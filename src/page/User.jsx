import { useParams } from 'react-router-dom'

function User() {
    const { id } = useParams()

    return (
      <section>
        <h2>User {id}</h2>
        <p>Cette page presente des informations a propos de l'utilisateur {id}.</p>
      </section>
    )
  }
  
  export default User
  