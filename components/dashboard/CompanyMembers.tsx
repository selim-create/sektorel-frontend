"use client";

import { FormEvent, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, CheckCircle2, Shield, Trash2, UserPlus, Users } from "lucide-react";

const COMPANY_MEMBERS_QUERY = gql`
  query SektorelCompanyMembers {
    sektorelCompanyMembers {
      userId
      displayName
      email
      role
      isOwner
    }
  }
`;

const ADD_MEMBER_MUTATION = gql`
  mutation AddSektorelCompanyMember($input: AddSektorelCompanyMemberInput!) {
    addSektorelCompanyMember(input: $input) {
      success
      message
      member { userId displayName email role isOwner }
    }
  }
`;

const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateSektorelCompanyMemberRole($input: UpdateSektorelCompanyMemberRoleInput!) {
    updateSektorelCompanyMemberRole(input: $input) {
      success
      message
      member { userId role }
    }
  }
`;

const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveSektorelCompanyMember($input: RemoveSektorelCompanyMemberInput!) {
    removeSektorelCompanyMember(input: $input) {
      success
      message
    }
  }
`;

type Member = {
  userId: number;
  displayName: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  isOwner: boolean;
};

const roleLabels: Record<Member["role"], string> = {
  owner: "Firma Sahibi",
  editor: "Editör",
  viewer: "Görüntüleyici",
};

export default function CompanyMembers() {
  const { data, loading, error, refetch } = useQuery(COMPANY_MEMBERS_QUERY, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  const [addMember, { loading: adding }] = useMutation(ADD_MEMBER_MUTATION, { errorPolicy: "all" });
  const [updateRole, { loading: updating }] = useMutation(UPDATE_ROLE_MUTATION, { errorPolicy: "all" });
  const [removeMember, { loading: removing }] = useMutation(REMOVE_MEMBER_MUTATION, { errorPolicy: "all" });
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const members: Member[] = data?.sektorelCompanyMembers || [];

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    setMessage("");
    setActionError("");

    const result = await addMember({
      variables: {
        input: {
          clientMutationId: "add-company-member",
          email: String(formData.get("email") || "").trim(),
          role: String(formData.get("role") || "viewer"),
        },
      },
    });

    const graphError = result.error?.message;
    const payload = result.data?.addSektorelCompanyMember;
    if (graphError || !payload?.success) {
      setActionError(graphError || payload?.message || "Kullanıcı eklenemedi.");
      return;
    }

    setMessage(payload.message || "Kullanıcı eklendi.");
    formElement.reset();
    await refetch();
  };

  const handleRoleChange = async (userId: number, role: string) => {
    setMessage("");
    setActionError("");
    const result = await updateRole({
      variables: {
        input: {
          clientMutationId: `update-member-${userId}`,
          userId,
          role,
        },
      },
    });

    const graphError = result.error?.message;
    const payload = result.data?.updateSektorelCompanyMemberRole;
    if (graphError || !payload?.success) {
      setActionError(graphError || payload?.message || "Rol güncellenemedi.");
      return;
    }

    setMessage(payload.message || "Rol güncellendi.");
    await refetch();
  };

  const handleRemove = async (member: Member) => {
    if (!window.confirm(`${member.displayName || member.email} ekipten çıkarılsın mı?`)) return;

    setMessage("");
    setActionError("");
    const result = await removeMember({
      variables: {
        input: {
          clientMutationId: `remove-member-${member.userId}`,
          userId: member.userId,
        },
      },
    });

    const graphError = result.error?.message;
    const payload = result.data?.removeSektorelCompanyMember;
    if (graphError || !payload?.success) {
      setActionError(graphError || payload?.message || "Kullanıcı çıkarılamadı.");
      return;
    }

    setMessage(payload.message || "Kullanıcı ekipten çıkarıldı.");
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-secondary">Alt Kullanıcılar</h1>
        <p className="mt-1 text-sm text-gray-500">
          Firmanıza bağlı ekip üyelerini yönetin. Bu aşamada yalnızca sistemde kayıtlı kullanıcılar eklenebilir.
        </p>
      </div>

      <div className="border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
        <strong>Rol kapsamı:</strong> Editör içerik üretebilir; görüntüleyici yalnızca erişebildiği ekranları görüntüler. Firma ayarları ve ekip yönetimi yalnızca firma sahibine açıktır.
      </div>

      {message ? (
        <div className="flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> {message}
        </div>
      ) : null}

      {actionError || error ? (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {actionError || error?.message}
        </div>
      ) : null}

      <form onSubmit={handleAdd} className="grid gap-4 border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_180px_auto]">
        <input
          name="email"
          type="email"
          required
          placeholder="Kayıtlı kullanıcının e-posta adresi"
          className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <select name="role" defaultValue="viewer" className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary">
          <option value="editor">Editör</option>
          <option value="viewer">Görüntüleyici</option>
        </select>
        <button
          type="submit"
          disabled={adding}
          className="inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-black uppercase text-white disabled:opacity-60"
        >
          <UserPlus size={16} /> {adding ? "Ekleniyor..." : "Kullanıcı Ekle"}
        </button>
      </form>

      <div className="border border-gray-200 bg-white shadow-sm">
        {loading && !data ? (
          <div className="p-8 text-sm text-gray-500">Ekip üyeleri yükleniyor...</div>
        ) : members.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {members.map((member) => (
              <div key={member.userId} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {member.isOwner ? <Shield size={16} className="text-primary" /> : <Users size={16} className="text-gray-400" />}
                    <h2 className="truncate font-bold text-secondary">{member.displayName || member.email}</h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{member.email}</p>
                </div>

                {member.isOwner ? (
                  <span className="text-xs font-black uppercase text-primary">{roleLabels.owner}</span>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={member.role}
                      disabled={updating || removing}
                      onChange={(event) => void handleRoleChange(member.userId, event.target.value)}
                      className="border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold text-secondary"
                    >
                      <option value="editor">Editör</option>
                      <option value="viewer">Görüntüleyici</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => void handleRemove(member)}
                      disabled={updating || removing}
                      className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-xs font-black uppercase text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} /> Çıkar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-gray-500">Henüz ekip üyesi bulunmuyor.</div>
        )}
      </div>
    </div>
  );
}
