import React, { Component } from 'react'
import authService from './auth-service';
import Loading from '../components/Loading'

const { Provider, Consumer } = React.createContext();

export const withAuth = (Comp) => { 
  return (props) => {
    return <Consumer>
      {value => {
        return <Comp {...value} {...props} />
      }}
    </Consumer>
  }
}

export default class AuthContext extends Component {

  state = {
    isLogged: false,
    user: null,
    isLoading: true,
    history: this.props.history
  }

  componentDidMount() {
    authService.me()
    .then((user)=>{
      this.setState({
        user,
        isLoading : false,
        isLogged : true
      })
    })
    .catch((error)=>{
      this.setState({
        isLogged : false,
        user : null,
        isLoading : false
      })
    })
  }

  handleSetUser = (user) => {
    this.setState({
      user,
      isLogged : true
    })
  }

  handleLogOut = () =>{
    authService.logout()
    .then(()=>{
      this.setState({
        user : null,
        isLogged : false
      })
    })
    .catch((error)=>{
      console.error(error)
    })
  }

  render() {
    const { isLoading } = this.state;
    return isLoading ? <Loading/> : <Provider value={{
      isLogged: this.state.isLogged,
      user: this.state.user,
      logout: this.handleLogOut,
      setUser: this.handleSetUser,
      history: this.state.history
    }}>
      {this.props.children}
    </Provider>
  }
}
