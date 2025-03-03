import { useState} from 'react';
import Link from 'next/link';

const InscriptionPro = () => {

  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [error, setError] = useState('');


  const handleSignUp = () => {


    fetch('http://localhost:3000/pros/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signUpUsername, 
        firstName: signUpFirstName,
        lastName: signUpLastName,
        password: signUpPassword, 
        confirmPassword: signUpConfirmPassword,
      
      }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {

          setSignUpUsername('');
          setSignUpPassword('');

console.log('cliqué et enregistré');
        } else {
          setError(data.error)

          console.log('cliqué');
        }
      });

  }

  return (
    <div>

      <p>{error}</p>
      <input
        type="text"
        placeholder="Nom de famille"
        id="signUpLastName"
        onChange={(e) => setSignUpLastName(e.target.value)}
        value={signUpLastName} />

      <input
        type="text"
        placeholder="Prénom"
        id="signUpFirstName"
        onChange={(e) => setSignUpFirstName(e.target.value)}
        value={signUpFirstName} />

      <input
        type="text"
        placeholder="Nom d'utilisateur"
        id="signUpUsername"
        onChange={(e) => setSignUpUsername(e.target.value)}
        value={signUpUsername} />

      <input
        type="text"
        placeholder="Mot de passe"
        id="signUpPassword"
        onChange={(e) => setSignUpPassword(e.target.value)}
        value={signUpPassword} />


      <input
        type="text"
        placeholder="Confirmer mot de passe"
        id="signUpConfirmPassword"
        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
        value={signUpConfirmPassword} />

      <button onClick={handleSignUp}>S'enregistrer</button>

      <p>Déjà inscrit ?</p>

      <button>
        <Link href="/connexionPro">Connexion</Link>
      </button>

    </div>

  );

}

export default InscriptionPro;