import {useState} from 'react';

const ConnexionPro = () => {
	const [signInUsername, setSignInUsername] = useState('');
	const [signInPassword, setSignInPassword] = useState('');
    const [error, setError] = useState('');

    const handleConnection = () => {

		fetch('http://localhost:3000/pros/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: signInUsername, password: signInPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					//dispatch(login({ username: signInUsername, token: data.token })); Je ne comprends pas à quoi sert cette ligne
					setSignInUsername('');
					setSignInPassword('');

			setError('')
            console.log(data)
				} else { setError(data.error)}
			});
	};
return (<div >
    <p>Connexion</p>
    <p>{error}</p>
    <input 
    type="text" 
    placeholder="Nom d'utilisateur" 
    id="signInUsername" 
    onChange={(e) => setSignInUsername(e.target.value)} 
    value={signInUsername} />

    <input 
    type="password" 
    placeholder="Password" 
    id="signInPassword" 
    onChange={(e) => setSignInPassword(e.target.value)} 
    value={signInPassword} />

    <button 
    id="connection" 
    onClick={() => handleConnection()}>
        Connexion
    </button>

    <p>Pas encore de compte ?</p>
    <button>Créer un compte</button>
</div>

)}



export default ConnexionPro;