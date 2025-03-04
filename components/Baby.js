import styles from '../styles/Baby.module.css';
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import moment from "moment";
import Link from "next/link";


const BabyPage = () => {
    const [baby, setBaby] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/baby/67c585260e52c1fcadd1a066`)
            .then(response => response.json())
            .then(data => {
                setBaby(data.data);
            });
    }, []);

    console.log(baby)
    if (!baby) {
        return <p>Chargement...</p>;
    }


//DONNEES POUR POIDS 
    const birthWeight = baby.birthWeight;
    const weights = baby.weight_id; // Liste des objets poids

    // Récupérer le dernier poids enregistré
    const lastWeightObj = weights.length > 0 ? weights[weights.length - 1] : null;
    const lastWeight = lastWeightObj ? lastWeightObj.weight : null;

    // Calcul de la variation de poids entre le poids de naissance et le dernier poids enregistré donc le poids.length -1 du dessus
    const variation = lastWeight
        ? ((birthWeight - lastWeight) / birthWeight) * 100
        : null;
    
    const variationNeg = lastWeight - birthWeight ? true : false;

    // Données pour le graphique
    const chartData = lastWeight ? [
            { name: "Poids actuel", value: lastWeight },
            { name: "Manquant", value: birthWeight - lastWeight },
        ] : null;


//DONNEES POUR ELIMINATION 
    //Pour trouver la dernière date et la mettre en forma horraire seulement
    const dataElim = baby.elimination_id

     // Trier les données par date décroissante (du plus récent au plus ancien)
    const sortedDataElim = [...dataElim].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Récupérer la dernière entrée
    const lastEntryElim = sortedDataElim[0];
    const formatedDateElim = moment(lastEntryElim.date).format("HH:mm")

    // Filtrer les valeurs à afficher
    const displayedFieldsElim = Object.entries(lastEntryElim)
        .filter(([key, value]) => (key === "urine" || key === "gambling") && value)
        .map(([key]) => key);

//DONNEES POUR TEMPERATURE
    const dataTemp = baby.temperature_id

     // Trier les données par date décroissante (du plus récent au plus ancien)
    const sortedDataTemp = [...dataTemp].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Récupérer la dernière entrée et mettre la date au bon forma
    const lastEntryTemp = sortedDataTemp[0];
    const formatedDateTemp = moment(lastEntryTemp.date).format("HH:mm")

//DONNEES POUR BAIN
    // Trouver le dernier bain donné (bath: true)
    const lastBath = baby.care_id
    .filter(care => care.bath) // Ne garder que les entrées où bath=true
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Trier par date décroissante et prendre le plus récent
    
    const formatedDateBath = moment(lastBath.date).format("HH:mm")

//DONNEES POUR Visage
    // Trouver le dernier bain donné (bath: true)
    const lastCareFace = baby.care_id
    .filter(care => care.faceCare) // Ne garder que les entrées où faceCare=true
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Trier par date décroissante et prendre le plus récent
    
    const formatedDateCareFace = moment(lastCareFace.date).format("HH:mm")
    
//DONNEES POUR CORDON
    // Trouver le dernier bain donné (bath: true)
    const lastCareCord = baby.care_id
    .filter(care => care.cordCare) // Ne garder que les entrées où cordCare=true
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Trier par date décroissante et prendre le plus récent
    
    const formatedDateCareCord = moment(lastCareCord.date).format("HH:mm")

//DONNEES POUR ALIMENTATION
    const dataAlim = baby.alimentation_id

    // Trier les données par date décroissante (du plus récent au plus ancien)
    const sortedDataAlim = [...dataAlim].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const formatedDateAlim = moment(sortedDataAlim.date).format("HH:mm")
    let lastFeeding = {}

    if(sortedDataAlim.breastFeeding?.length > 0) {
        lastFeeding = {duration: sortedDataAlim.breastFeeding[0].duration, breast: sortedDataAlim.breastFeeding[0].breast, foodSupplement: sortedDataAlim.breastFeeding[0].foodSupplement, date:formatedDateAlim}
    } else {
        lastFeeding = {amount: sortedDataAlim.feedingBottle[0].amount, date: formatedDateAlim}
    }


    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" />
                <p className={styles.babyName}>{baby.name}</p>
                <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
            </div>

            {/* Données */}
            <div className={styles.data}>
                <div className={styles.weigthContainer}>
                    {lastWeight ? (
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
                                            <p className={styles.variationText}>+ {variation.toFixed(1)}% </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.weightInfo}>
                                        <p>Variation du poids depuis la naissance :</p>
                                        <div>
                                            <img src='/flecheVariationHaut'></img>
                                            <p className={styles.smallWeight}>+ {variation.toFixed(1)}% </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                    ) : (
                        <p className={styles.noData}>Aucune donnée de poids enregistrée</p>
                    )}
                        <button className={styles.detailButton}>
                            <p>Voir le détail</p>
                            <img src='/chevron.svg' className={styles.logoButton}></img>
                        </button>
                </div>
                <div className={styles.sousContainer}>
                    <div className={styles.alimContainer}>
                        {sortedDataAlim.breastFeeding?.length > 0 ? (
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
                                 <p className={styles.textBold}>{lastFeeding.amount}</p>
                            </div>
                        )}
                        <button className={styles.detailButton}>
                            <p>Voir le détail</p>
                            <img src='/chevronRight.svg' className={styles.logoButton}></img>
                        </button>
                    </div>
                    <div className={styles.elimContainer}>
                        <img className={styles.logoElim} src='/couche.svg'></img>
                        <p>{formatedDateElim}</p>
                        <p className={styles.textBold} >{displayedFieldsElim.length > 0 ? displayedFieldsElim.join(" & ") : "Aucune donnée disponible"}</p>
                        <button className={styles.detailButton}>
                            <p>Voir le détail</p>
                            <img src='/chevronRight.svg' className={styles.logoButton}></img>
                        </button>
                        </div>
                </div>
                <div className={styles.tempContainer}>
                    <div className={styles.tempChart}>
                        <img className={styles.logoTemp} src='/temperature.svg'></img>
                        <div className={styles.tempData}>
                            <p className={styles.textBold} >{lastEntryTemp !== null ? 
                            `${lastEntryTemp.temperature}°C` : "Aucune donnée disponible"}</p>
                            <p>{formatedDateTemp}</p>
                        </div>
                    </div>
                    <button className={styles.detailButton}>
                            <p>Voir le détail</p>
                            <img src='/chevronRight.svg' className={styles.logoButton}></img>
                    </button>
                </div>
                <div className={styles.sousContainer}>
                    <div className={styles.bathContainer}>
                        <p className={styles.textBold}>Bain</p>
                        <img className={styles.logoCare} src='/bain.svg'></img>
                        <p>{formatedDateBath}</p>
                        <button className={styles.detailButton}>
                            <p>Voir le détail</p>
                            <img src='/chevronRight.svg' className={styles.logoButton}></img>
                        </button>
                        </div>
                    <div className={styles.faceContainer}>
                        <p className={styles.textBold}>Visage</p>
                        <img className={styles.logoCare} src='/visage.svg'></img>
                        <p>{formatedDateCareFace}</p>
                        <button className={styles.detailButton}>
                            <p>Voir le détail</p>
                            <img src='/chevronRight.svg' className={styles.logoButton}></img>
                        </button>
                        </div>
                    <div className={styles.cordContainer}>
                        <p className={styles.textBold}>Cordon</p>
                        <img className={styles.logoCare} src='/Cordon.svg'></img>
                        <p>{formatedDateCareCord}</p>
                        <button className={styles.detailButton}>
                            <p>Voir le détail</p>
                            <img src='/chevronRight.svg' className={styles.logoButton}></img>
                        </button>
                        </div>
                </div>
                <Link href={"/newData"}>
                    <button className={styles.button}> Nouvelles données </button>
                </Link>
            </div>
        </div>
    );
};

export default BabyPage;
