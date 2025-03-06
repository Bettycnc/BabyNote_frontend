import styles from '../../../styles/styles_detailPage/composantDetail.module.css'


function Care(props) {
    return (
        <div className={styles.containerCare}>
            <img src={props.image} className={styles.images}></img>
            <div>
                <p>{props.date}</p>
            </div>
            <div className={styles.btnContainerCare}>
                <button className={styles.selectBtn} onClick={props.onClickSelect}>
                    <img src='/edit.svg'></img>
                </button>
            </div>
        </div>
    );
}

export default Care;