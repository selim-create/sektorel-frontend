"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { BellRing, CheckCircle2, Loader2, LogIn, Trash2 } from "lucide-react";
import { ensureSession, subscribeToAuthChanges } from "@/lib/auth";

const EVENT_REMINDER_QUERY = gql`
  query SektorelEventReminder($eventSlug: String!) {
    sektorelEventReminder(eventSlug: $eventSlug) {
      databaseId
      eventId
      eventTitle
      eventSlug
      daysBefore
      remindAt
      status
    }
  }
`;

const SAVE_EVENT_REMINDER = gql`
  mutation SaveSektorelEventReminder($input: SaveSektorelEventReminderInput!) {
    saveSektorelEventReminder(input: $input) {
      success
      message
      reminder {
        databaseId
        eventId
        eventTitle
        eventSlug
        daysBefore
        remindAt
        status
      }
    }
  }
`;

const CANCEL_EVENT_REMINDER = gql`
  mutation CancelSektorelEventReminder($input: CancelSektorelEventReminderInput!) {
    cancelSektorelEventReminder(input: $input) {
      success
      message
    }
  }
`;

type Reminder = {
  databaseId?: number | null;
  eventId?: number | null;
  eventTitle?: string | null;
  eventSlug?: string | null;
  daysBefore?: number | null;
  remindAt?: string | null;
  status?: string | null;
};

type ReminderQueryData = {
  sektorelEventReminder?: Reminder | null;
};

type ReminderQueryVariables = {
  eventSlug: string;
};

type SaveReminderData = {
  saveSektorelEventReminder?: {
    success?: boolean | null;
    message?: string | null;
    reminder?: Reminder | null;
  } | null;
};

type SaveReminderVariables = {
  input: {
    clientMutationId: string;
    eventSlug: string;
    daysBefore: number;
  };
};

type CancelReminderData = {
  cancelSektorelEventReminder?: {
    success?: boolean | null;
    message?: string | null;
  } | null;
};

type CancelReminderVariables = {
  input: {
    clientMutationId: string;
    eventSlug: string;
  };
};

type EventReminderControlProps = {
  eventSlug: string;
  startDate: string;
};

function formatReminderDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventReminderControl({ eventSlug, startDate }: EventReminderControlProps) {
  const pathname = usePathname();
  const [authState, setAuthState] = useState<"checking" | "guest" | "authenticated">("checking");
  const [daysBefore, setDaysBefore] = useState(1);
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      const authenticated = await ensureSession();
      if (active) {
        setAuthState(authenticated ? "authenticated" : "guest");
      }
    };

    void verifySession();
    const unsubscribe = subscribeToAuthChanges(() => void verifySession());

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const { data, loading: reminderLoading, error: reminderError } = useQuery<ReminderQueryData, ReminderQueryVariables>(
    EVENT_REMINDER_QUERY,
    {
      variables: { eventSlug },
      skip: authState !== "authenticated",
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  );

  const [saveReminder, { loading: saving }] = useMutation<SaveReminderData, SaveReminderVariables>(
    SAVE_EVENT_REMINDER,
    { errorPolicy: "all" },
  );
  const [cancelReminder, { loading: cancelling }] = useMutation<CancelReminderData, CancelReminderVariables>(
    CANCEL_EVENT_REMINDER,
    { errorPolicy: "all" },
  );

  useEffect(() => {
    const reminder = data?.sektorelEventReminder ?? null;
    setCurrentReminder(reminder);
    if (reminder?.daysBefore) {
      setDaysBefore(reminder.daysBefore);
    }
  }, [data]);

  const eventDate = new Date(startDate);
  if (!Number.isNaN(eventDate.getTime()) && eventDate.getTime() <= Date.now()) {
    return null;
  }

  const handleSave = async () => {
    setMessage("");
    setActionError("");

    try {
      const result = await saveReminder({
        variables: {
          input: {
            clientMutationId: `event-reminder-${eventSlug}`,
            eventSlug,
            daysBefore,
          },
        },
      });

      const payload = result.data?.saveSektorelEventReminder;
      const graphError = result.error?.message;
      if (graphError || !payload?.success || !payload.reminder) {
        setActionError(graphError || payload?.message || "Hatırlatma kaydedilemedi.");
        return;
      }

      setCurrentReminder(payload.reminder);
      setMessage(payload.message || "Hatırlatma kaydedildi.");
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Hatırlatma kaydedilemedi.");
    }
  };

  const handleCancel = async () => {
    setMessage("");
    setActionError("");

    try {
      const result = await cancelReminder({
        variables: {
          input: {
            clientMutationId: `cancel-event-reminder-${eventSlug}`,
            eventSlug,
          },
        },
      });

      const payload = result.data?.cancelSektorelEventReminder;
      const graphError = result.error?.message;
      if (graphError || !payload?.success) {
        setActionError(graphError || payload?.message || "Hatırlatma iptal edilemedi.");
        return;
      }

      setCurrentReminder(null);
      setMessage(payload.message || "Hatırlatma iptal edildi.");
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : "Hatırlatma iptal edilemedi.");
    }
  };

  if (authState === "checking") {
    return (
      <div className="flex items-center justify-center gap-2 border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        <Loader2 className="animate-spin" size={14} /> Oturum kontrol ediliyor
      </div>
    );
  }

  if (authState === "guest") {
    const redirect = pathname || `/ajanda/${eventSlug}`;
    return (
      <Link
        className="flex w-full items-center justify-center gap-2 border border-primary/30 bg-primary/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-white"
        href={`/giris?redirect=${encodeURIComponent(redirect)}`}
      >
        <LogIn size={14} /> Giriş Yap ve Hatırlat
      </Link>
    );
  }

  return (
    <div className="border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BellRing size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wider text-secondary">E-posta Hatırlatması</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">Etkinlik yaklaşırken hesabınızdaki e-posta adresine bildirim gönderilir.</p>
        </div>
      </div>

      {reminderLoading ? (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Loader2 className="animate-spin" size={13} /> Hatırlatma bilgisi yükleniyor...
        </div>
      ) : (
        <>
          {currentReminder ? (
            <div className="mt-4 flex items-start gap-2 border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
              <CheckCircle2 className="mt-0.5 shrink-0" size={14} />
              <div>
                <p className="font-bold">{currentReminder.daysBefore} gün önce hatırlatma aktif.</p>
                {currentReminder.remindAt ? <p className="mt-1">Gönderim: {formatReminderDate(currentReminder.remindAt)}</p> : null}
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex gap-2">
            <select
              aria-label="Hatırlatma zamanı"
              className="min-w-0 flex-1 border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-secondary outline-none focus:border-primary"
              disabled={saving || cancelling}
              onChange={(event) => setDaysBefore(Number(event.target.value))}
              value={daysBefore}
            >
              <option value={1}>1 gün önce</option>
              <option value={3}>3 gün önce</option>
              <option value={7}>1 hafta önce</option>
            </select>
            <button
              className="shrink-0 bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving || cancelling}
              onClick={() => void handleSave()}
              type="button"
            >
              {saving ? "Kaydediliyor" : currentReminder ? "Güncelle" : "Hatırlat"}
            </button>
          </div>

          {currentReminder ? (
            <button
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 transition hover:text-red-600 disabled:opacity-60"
              disabled={saving || cancelling}
              onClick={() => void handleCancel()}
              type="button"
            >
              <Trash2 size={13} /> {cancelling ? "İptal ediliyor..." : "Hatırlatmayı iptal et"}
            </button>
          ) : null}
        </>
      )}

      {message ? <p className="mt-3 text-xs font-bold text-green-700">{message}</p> : null}
      {actionError || reminderError ? (
        <p className="mt-3 text-xs font-bold leading-5 text-red-600">{actionError || reminderError?.message}</p>
      ) : null}
    </div>
  );
}
