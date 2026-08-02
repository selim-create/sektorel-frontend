"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import FallbackUI from "@/components/error/FallbackUI";
import { logGraphQLError } from "@/lib/error-handler";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logGraphQLError("client boundary", error);
    if (errorInfo.componentStack) {
      console.error(
        "[GraphQL] client boundary - Component Stack:",
        errorInfo.componentStack,
      );
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <FallbackUI
          title="Bir şeyler ters gitti"
          message="Sayfa içeriği şu anda yüklenemedi. Lütfen yeniden deneyin."
          actionLabel="Tekrar dene"
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
