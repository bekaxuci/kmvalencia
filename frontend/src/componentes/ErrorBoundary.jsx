import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado en ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: "1rem", color: "red" }}>
        <h2>Algo salió mal en FormularioRuta.</h2>
        <pre>{this.state.error?.toString()}</pre>
      </div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
