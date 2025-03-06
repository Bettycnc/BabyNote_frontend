import styles from '../../../styles/styles_detailPage/composantDetail.module.css'
import { useState } from 'react';
import { Modal } from '@mui/material';

function Elimination(props) {

    return (
        <div className={styles.container}>
            <img src='/couche.svg' className={styles.images}></img>
            <div className={styles.infoContainer}>
                <div className={styles.date}>
                    <p>{props.date}</p>
                </div>
                <p className={styles.titre}>{props.info}</p>
            </div>
            <div className={styles.btnContainer}>
                <button className={styles.selectBtn} onClick={props.onClickSelect}>
                    <img src='/edit.svg'></img>
                </button>
            </div>
        </div>
    );
}

export default Elimination;
