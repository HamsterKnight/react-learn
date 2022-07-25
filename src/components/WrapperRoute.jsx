import { Route } from 'react-router-dom'
const Index = ({Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
              <Component {...props}/>
          )}>
        </Route>
    )
}
export default Index