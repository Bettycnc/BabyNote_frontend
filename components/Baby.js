import styles from '../styles/Baby.module.css';
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import moment from "moment";
import Link from "next/link";
import {useSelector } from "react-redux";
import Menu from './Menu'


const BabyPage = () => {
    const [baby, setBaby] = useState(null);
    const user = useSelector((state) => state.user.value);
    const [isBurgerMenuVisible, setIsBurgerMenuVisible] = useState(false)

    useEffect(() => {
        fetch(`http://localhost:3000/baby/${user.babies[0]._id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setBaby(data.data);
            });
    }, [isBurgerMenuVisible]); 


    if (!baby) {
        return <p>Chargement...</p>;
    }

    const displayMenu = () => {
        setIsBurgerMenuVisible(true)
    }

    const handelClose = () => {
        setIsBurgerMenuVisible(false)
    }

//DONNEES POUR POIDS 
    const birthWeight = baby.birthWeight;

    const weights = baby.weight_id; // Liste des objets poids

    // Récupérer le dernier poids enregistré
    const lastWeightObj = weights.length > 0 ? weights[weights.length - 1] : null;
    const lastWeight = lastWeightObj ? lastWeightObj.weight : null;

    // Calcul de la variation de poids entre le poids de naissance et le dernier poids enregistré donc le poids.length -1 du dessus
    const variationCalcul = birthWeight - lastWeight
    const variationNeg = variationCalcul > 0 ? true : false

    const variation = variationNeg
        ? ((birthWeight - lastWeight) / birthWeight) * 100
        : ((lastWeight - birthWeight) / birthWeight) * 100;

    // Données pour le graphique
    const chartData = lastWeight ? [
            { name: "Poids actuel", value: lastWeight },
            { name: "Manquant", value: birthWeight - lastWeight },
        ] : null;


//DONNEES POUR ELIMINATION 
    //Pour trouver la dernière date et la mettre en forma horraire seulement
    const dataElim = baby.elimination_id

     // Trier les données par date décroissante (du plus récent au plus ancien)
    const sortedDataElim = dataElim.length >0 ? [...dataElim].sort((a, b) => new Date(b.date) - new Date(a.date)) : null;

    // Récupérer la dernière entrée
    const lastEntryElim = dataElim.length >0 ? sortedDataElim[0] : null;
    const formatedDateElim = lastEntryElim ? moment(lastEntryElim.date).format("HH:mm") : null;

    // Filtrer les valeurs à afficher, si urine=true alors on affiche Urines et si gambling=true alors on affiche Selles
    const displayedFieldsElim = lastEntryElim ? Object.entries(lastEntryElim)
    .filter(([key, value]) => (key === "urine" || key === "gambling") && value)
    .map(([key]) => key === "urine" ? "Urines" : "Selles")
    .join(" & ") : null;

//DONNEES POUR TEMPERATURE
    const dataTemp = baby.temperature_id

     // Trier les données par date décroissante (du plus récent au plus ancien)
    const sortedDataTemp = dataTemp.length >0 ? [...dataTemp].sort((a, b) => new Date(b.date) - new Date(a.date)) :null;

    // Récupérer la dernière entrée et mettre la date au bon forma
    const lastEntryTemp = baby.temperature_id.length > 0 ? sortedDataTemp[0] : null;

    const formatedDateTemp = lastEntryTemp ? moment(lastEntryTemp.date).format("HH:mm") : null;

//DONNEES POUR BAIN
    // Trouver le dernier bain donné (bath: true)
    const lastBath = baby.care_id
    .filter(care => care.bath) // Ne garder que les entrées où bath=true
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Trier par date décroissante et prendre le plus récent
    
    const formatedDateBath = lastBath ? moment(lastBath.date).format("HH:mm") : null;

//DONNEES POUR Visage
    // Trouver le dernier bain donné (bath: true)
    const lastCareFace = baby.care_id
    .filter(care => care.faceCare) // Ne garder que les entrées où faceCare=true
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Trier par date décroissante et prendre le plus récent


    const formatedDateCareFace = lastCareFace ? moment(lastCareFace.date).format("HH:mm") : null;

    
//DONNEES POUR CORDON
    // Trouver le dernier bain donné (bath: true)
    const lastCareCord = baby.care_id
    .filter(care => care.cordCare) // Ne garder que les entrées où cordCare=true
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Trier par date décroissante et prendre le plus récent
    
    const formatedDateCareCord = lastCareCord ? moment(lastCareCord.date).format("HH:mm"): null;

//DONNEES POUR ALIMENTATION
const dataAlim = baby.alimentation_id;
let lastFeeding = {};

// Vérifier si les données existent et trier par date décroissante
const sortedDataAlim = dataAlim.length > 0 ? [...dataAlim].sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;

// Initialiser la date formatée
const formatedDateAlim = sortedDataAlim ? moment(sortedDataAlim.date).format("HH:mm") : 'Aucune donnée';

// Si `sortedDataAlim` est null (aucune donnée), pas besoin de continuer
if (!sortedDataAlim) {
    lastFeeding = { date: formatedDateAlim };
} else {
    // Vérifier que sortedDataAlim a bien les propriétés attendues
    const breathfeeding = sortedDataAlim.breastFeeding;
    const feedingBottle = sortedDataAlim.feedingBottle;

    if (breathfeeding && breathfeeding.length > 0) {
        lastFeeding = {
            duration: breathfeeding[0].duration,
            breast: breathfeeding[0].breast,
            foodSupplement: breathfeeding[0].foodSupplement,
            date: formatedDateAlim
        };
    } else if (feedingBottle && feedingBottle.length > 0) {
        lastFeeding = { amount: feedingBottle[0].amount, date: formatedDateAlim };
    }
}


    return (
        <div>
        {isBurgerMenuVisible === true && (
            <Menu handelClose={handelClose}/>
        )}
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" />
                <p className={styles.babyName}>{user.babies[0].name}</p>
                <button style={{backgroundColor: 'transparent', cursor: 'pointer', border:'none'}}  onClick={displayMenu}>
                        <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
                </button>
            </div>

            {/* Données */}
            <div className={styles.data}>

                {/* poids */} 
                {lastWeight ? (
                    <div className={styles.weigthContainer}>
                        <div className={styles.weightCard}>
                            <div className={styles.chartContainer}>
                            <PieChart width={120} height={120}>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={60}
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={5}
                                >
                                    <Cell fill="#1E567C" />
                                    <Cell fill="#E0E0E0" />
                                </Pie>
                                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className={styles.bigWeight}>{lastWeight} g</text>
                                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className={styles.smallWeight}>/ {birthWeight} g</text>
                            </PieChart>
                            </div>
                                {variationNeg ? (
                                    <div className={styles.weightInfo}>
                                        <p>Variation du poids depuis la naissance :</p>
                                         <div className={styles.variationVal}>
                                            <img className={styles.flecheBas} src='/flecheVariationBas.svg'></img>
                                            <p className={styles.variationText}>{variation.toFixed(1)}% </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.weightInfo}>
                                        <p>Variation du poids depuis la naissance :</p>
                                        <div className={styles.variationVal}>
                                            <img className={styles.flecheBas} src='/flecheVariationHaut.svg'></img>
                                            <p className={styles.variationText}>+ {variation.toFixed(1)}% </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                        <Link href={"/weight"}>
                            <button className={styles.detailButton}>
                                <p>Voir le détail</p>
                                <img src='/chevronRight.svg' className={styles.logoButton}></img>
                            </button>
                        </Link>    
                    </div>
                    ) : (
                        <div className={styles.weigthContainerNull}>
                            <p>Poids à la naissance : <span className={styles.noData} > {baby.birthWeight} g</span></p>
                        </div>
                    )}
                <div className={styles.sousContainer}>

                    {/* alimentation */}
                    {sortedDataAlim !== null ? (
                        <div className={styles.alimContainer}>
                            {sortedDataAlim.breastFeeding ?.length > 0 ? (
                                <div>
                                    <img className={styles.logoAlim} src='/allaitement.svg'></img>
                                    <p>{lastFeeding.date}</p>
                                    <p className={styles.textBold}>{lastFeeding.duration} min</p>
                                        {lastFeeding.foodSupplement.foodSupplementPresent !== true ? (
                                            <p>Complément : Oui</p>
                                        ) : (
                                            <p>Complément : Non</p>
                                        )}
                                </div>
                            ) : (
                                <div>
                                    <img className={styles.logoAlim} src='/Biberon.svg' ></img>
                                     <p>{lastFeeding.date}</p>
                                     <p className={styles.textBold}>{lastFeeding.amount} mL</p>
                                </div>
                            )}
                            <Link href={"/alimentation"}>
                                <button className={styles.detailButton}>
                                    <p>Voir le détail</p>
                                    <img src='/chevronRight.svg' className={styles.logoButton}></img>
                                </button>
                            </Link>
                            
                            </div>
                        ) : (
                            <div className={styles.alimContainerNull}>
                                <p className={styles.alimDataNull} >Aucune donnée disponible</p>
                            </div>
                        )}
                    

                    {/* elimination */}
                    {sortedDataElim ? (
                        <div className={styles.elimContainer}>
                                <img className={styles.logoElim} src='/couche.svg'></img>
                                <p>{formatedDateElim}</p>
                                <p className={styles.textBold} >{displayedFieldsElim}</p>
                                <Link href={"/elimination"}>
                                    <button className={styles.detailButton}>
                                        <p>Voir le détail</p>
                                        <img src='/chevronRight.svg' className={styles.logoButton}></img>
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.alimContainerNull}>
                                <p className={styles.alimDataNull} >Aucune donnée disponible</p>
                            </div>
                        )}
                        
                </div>

                {/* temperature  */}
                    {sortedDataTemp ? (
                        <div className={styles.tempContainer}>
                            <div className={styles.tempChart}>
                                <img className={styles.logoTemp} src='/temperature.svg'></img>
                                <div className={styles.tempData}>
                                    <p className={styles.textBold} >
                                    {lastEntryTemp.temperature} °C</p>
                                    <p>{formatedDateTemp}</p>
                                </div>
                            </div>
                            <Link href={"/temperature"}>
                                <button className={styles.detailButton}>
                                        <p>Voir le détail</p>
                                        <img src='/chevronRight.svg' className={styles.logoButton}></img>
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.tempContainer}>
                        <div className={styles.TempDataNull}>
                            <p className={styles.TempDataNulltext}>Aucune donnée disponible</p>
                        </div>
                        </div>
                    )}
                    
                <div className={styles.sousContainer}>
                
                {/* bain */}
                {formatedDateBath ? (
                    <div className={styles.bathContainer}>
                        <p className={styles.textBold}>Bain</p>
                        <img className={styles.logoCare} src='/bain.svg'></img>
                        <p>{formatedDateBath}</p>
                        <Link href={"/bath"}>
                            <button className={styles.detailButton}>
                                <p>Voir le détail</p>
                                <img src='/chevronRight.svg' className={styles.logoButton}></img>
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className={styles.bathContainerNull}>
                        <p className={styles.textBold}>Aucune donnée disponible</p>
                    </div>
                )}
                {/* soin visage */}
                    {formatedDateCareFace ? (
                        <div className={styles.faceContainer}>
                            <p className={styles.textBold}>Visage</p>
                            <img className={styles.logoCare} src='/visage.svg'></img>
                            <p>{formatedDateCareFace}</p>
                            <Link href={"/faceCare"}>
                                <button className={styles.detailButton}>
                                    <p>Voir le détail</p>
                                    <img src='/chevronRight.svg' className={styles.logoButton}></img>
                                </button>
                            </Link>
                        </div>
                    ): (
                        <div className={styles.bathContainerNull}>
                         <p className={styles.textBold}>Aucune donnée disponible</p>
                        </div>
                    )}
                {/* soin cordon */}
                    {formatedDateCareCord ? (
                        <div className={styles.cordContainer}>
                            <p className={styles.textBold}>Cordon</p>
                            <img className={styles.logoCare} src='/Cordon.svg'></img>
                            <p>{formatedDateCareCord}</p>
                            <Link href={"/cordCare"}>
                                <button className={styles.detailButton}>
                                    <p>Voir le détail</p>
                                    <img src='/chevronRight.svg' className={styles.logoButton}></img>
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.bathContainerNull}>
                            <p className={styles.textBold}>Aucune donnée disponible</p>
                        </div>
                    )}
                </div>

                <Link href={"/newData"}>
                    <button className={styles.button}> Nouvelles données </button>
                </Link>
            </div>
        </div>
    </div>
    )
};

export default BabyPage;