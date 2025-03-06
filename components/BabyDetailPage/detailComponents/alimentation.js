import styles from '../../../styles/styles_detailPage/composantDetail.module.css'


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
                        <p className={styles.titre}>{props.amount} mL</p>
                    </div>
                ) : (
                    <div>
                        <p className={styles.titre}>{props.which}</p>
                        <p className={styles.titre}>{props.duration} min</p>
                    {props.complement === true ? (
                        <div>
                            <p className={styles.complementBold}>Complément:</p>
                            <p className={styles.complementInfo}>{props.complementType}/{props.complementMethode} :      {props.complementAmount} mL</p>
                        </div>
                    ): (
                        <p className={styles.complementInfo}>Ø Compléments</p>
                    )}
                    </div>
                )}

			</div>
            <div className={styles.btnContainer}>
                <button className={styles.selectBtn} onClick={props.onClickSelect}>
                    <img src='/edit.svg'></img>
                </button>
            </div>
		</div>
	);
}

export default Alimentation;
