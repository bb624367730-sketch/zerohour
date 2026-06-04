import { Component, type ReactNode } from 'react';
import type { Lang } from '../i18n/translations';

interface Props {
  children: ReactNode;
  lang: Lang;
}

interface State {
  error: Error | null;
}

const messages: Record<Lang, { title: string; retry: string }> = {
  en: { title: 'Something went wrong. Please refresh the page.', retry: 'Retry' },
  'zh-CN': { title: '出了点问题，请刷新页面。', retry: '重试' },
  ja: { title: '問題が発生しました。ページを更新してください。', retry: '再試行' },
  ko: { title: '문제가 발생했습니다. 페이지를 새로고침해 주세요.', retry: '재시도' },
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const msg = messages[this.props.lang] ?? messages.en;
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 24,
          textAlign: 'center',
          background: '#0a0a0f',
          color: '#e0e0e0',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>
          <h2 style={{ marginBottom: 12 }}>{msg.title}</h2>
          <button
            className="btn btn-primary"
            onClick={this.handleRetry}
            style={{ marginTop: 16 }}
          >
            {msg.retry}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
