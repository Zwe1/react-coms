import React,{ Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    }
  }

  componentDidCatch(err, info) {
    this.setState({hasError: true});
    console.log('组件内部发生错误:', err, info);
  }

  render() {
    const { errCom = null } = this.props;

    if (this.state.hasError) {
      if (!errCom) {
        return <div>组件发生异常</div>
      }
      return <div>{errCom}</div>
    }

    return this.props.children;
  }
}