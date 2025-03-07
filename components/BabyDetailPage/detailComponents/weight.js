import styles from '../../../styles/styles_detailPage/composantDetail.module.css'


function Weight(props) {
    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div className={styles.date}>
                    <p>{props.date}</p>
                </div>
                <p className={styles.titre}>{props.info} g</p>
            </div>
            <div className={styles.btnContainer}>
                <button className={styles.selectBtn} onClick={props.onClickSelect}>
                    <img src='/edit.svg'></img>
                </button>
            </div>
        </div>
    );
}

export default Weight;