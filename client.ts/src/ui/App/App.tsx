import * as React from 'react'
import withStyles, {WithStyles} from 'react-jss'
import AddTodo from 'ui/AddTodo'
import TodoList from 'ui/TodoList'
// import { green } from 'logger'

interface IProps extends WithStyles<typeof styles> {
  classes: any
  children: React.ReactNode
}

const App:  React.FunctionComponent<IProps> = ({ classes }) => {

  // green('props', classes.wrapper)
  return (
    <div className={classes.wrapper}>
      <AddTodo />
      <TodoList />
    </div>
  )
}

const styles = {
  wrapper: {
    // backgroundColor: 'red',
    minHeight: '100vh',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
  },
  section: {
    // backgroundColor: 'green',
    height: '100%',
    flexGrow: 1,
    minHeight: 500,
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },
  main: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}

export default withStyles(styles)(App)
