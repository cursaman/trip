import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error, info) { console.error(error, info); }
  render() {
    if (this.state.failed) {
      return (
        <main className="fatal">
          <h1>화면을 표시하지 못했습니다.</h1>
          <p>저장 데이터를 정리하거나 페이지를 다시 불러와 주세요.</p>
          <button className="button" onClick={() => location.reload()}>새로고침</button>
        </main>
      );
    }
    return this.props.children;
  }
}
