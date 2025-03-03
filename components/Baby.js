import styles from '../styles/Baby.module.css';
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import moment from "moment";

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
    .filter(care => care.faceCare) // Ne garder que les entrées où bath=true
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Trier par date décroissante et prendre le plus récent
    
    const formatedDateCareFace = moment(lastBath.date).format("HH:mm")
    
//DONNEES POUR CORDON
    // Trouver le dernier bain donné (bath: true)
    const lastCareCord = baby.care_id
    .filter(care => care.cordCare) // Ne garder que les entrées où bath=true
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Trier par date décroissante et prendre le plus récent
    
    const formatedDateCareCord = moment(lastBath.date).format("HH:mm")

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
                            <PieChart width={120} height={120}>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={50}
                                    startAngle={90}
                                    endAngle={-270}
                                    fill="#1E567C"
                                    >
                                    <Cell fill="#1E567C" />
                                    <Cell fill="#E0E0E0" />
                                </Pie>
                            </PieChart>
                            <div className={styles.weightInfo}>
                                <p className={styles.bigWeight}>{lastWeight} g</p>
                                <p className={styles.smallWeight}>/ {birthWeight} g</p>
                                {variation !== null && (
                                    <p className={styles.variation}>
                                        <span className={variation >= 0 ? styles.positive : styles.negative}>
                                            {variation.toFixed(1)}%
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className={styles.noData}>Aucune donnée de poids enregistrée</p>
                    )}
                </div>
                <div className={styles.sousContainer}>
                    <div className={styles.alimContainer}>
                        <img src='/Biberon.svg'></img>
                        <p></p>
                    </div>
                    <div className={styles.elimContainer}>
                        <img src='/couche.svg'></img>
                        <p>{formatedDateElim}</p>
                        <p>{displayedFieldsElim.length > 0 ? displayedFieldsElim.join(" & ") : "Aucune donnée disponible"}</p>
                    </div>
                </div>
                <div className={styles.tempContainer}>
                    <img src='/temperature.svg'></img>
                    <p>{formatedDateTemp}</p>
                    <p>{lastEntryTemp !== null ? lastEntryTemp.temperature : "Aucune donnée disponible"}</p>
                </div>
                <div className={styles.sousContainer}>
                    <div className={styles.bathContainer}>
                        <p>Bain</p>
                        <img src='/bain.svg'></img>
                        <p>{formatedDateBath}</p>
                    </div>
                    <div className={styles.faceContainer}>
                        <p>Visage</p>
                        <img src='/visage.svg'></img>
                        <p>{formatedDateCareFace}</p>
                    </div>
                    <div className={styles.cordContainer}>
                        <p>Cordon</p>
                        <img src='/Cordon.svg'></img>
                        <p>{formatedDateCareCord}</p>
                    </div>
                </div>

                <button className={styles.button}>Nouvel évènement</button>
            </div>
        </div>
    );
};

export default BabyPage;
