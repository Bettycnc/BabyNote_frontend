import styles from '../../../styles/styles_detailPage/Alimentation.module.css'


function Alimentation(props) {
	return (
		<div className={styles.container}>
            <img src={props.image} className={styles.images}></img>
			<div className={styles.infoContainer}>
                <div className={styles.date}>
                    <p>{props.date}</p>
                </div>
                {props.biberon === true ? (
                    <div>
                        <p>{props.amount} mL</p>
                    </div>
                ) : (
                    <div>
                        <p>{props.which}</p>
                        <p>{props.duration} min</p>
                    {props.complement === true ? (
                        <div>
                            <p>Complément:</p>
                            <p>{props.complementType}/{props.complementMethode} :      {props.complementAmount} mL</p>
                        </div>
                    ): (
                        <p>Ø Compléments</p>
                    )}
                    </div>
                )}

			</div>
            <div className={styles.btnContainer}>
                <button className={styles.selectBtn} onClick={props.onClickSelect}>
                </button>
            </div>
		</div>
	);
}

export default Alimentation;
