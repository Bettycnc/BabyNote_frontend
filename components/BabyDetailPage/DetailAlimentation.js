import Alimentation from "./detailComponents/alimentation";
import styles from '../../styles/styles_detailPage/DetailAlimentation.module.css';
import { useEffect, useState } from "react";

function DetailAlimentation() {
    const [baby, setBaby] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/babyData/67c585260e52c1fcadd1a066/alimentation`)
            .then(response => response.json())
            .then(data => {
                setBaby(data.data);
            });
    }, []);

    if (!baby) {
        return <p>Chargement...</p>;
    }

    console.log(baby)

    const data = baby.map((entry, i) => {
        // Vérifier si c'est un biberon ou allaitement
        const hasFeedingBottle = entry.feedingBottle.length > 0;
        const feedingData = hasFeedingBottle ? entry.feedingBottle[0] : null;
        
        // Vérifier s'il y a une donnée d'allaitement
        const breastData = !hasFeedingBottle && entry.breastFeeding.length > 0 ? entry.breastFeeding[0] : null;
    
        // Vérifier si un complément alimentaire est présent
        const complement = breastData && breastData.foodSupplement && breastData.foodSupplement.length > 0 
            ? breastData.foodSupplement[0] 
            : null;
        
        return (
            <Alimentation 
                key={i} 
                image={hasFeedingBottle ? "/Biberon.svg" : "/allaitement.svg"} // Adapter l'image
                date={new Date(entry.date).toLocaleDateString()} // Formatage de la date
                biberon={hasFeedingBottle} 
                amount={hasFeedingBottle ? feedingData.amount : null} 
                which={breastData ? breastData.breast[0] : "N/A"} // `breast` est un tableau
                duration={breastData ? breastData.duration : null} 
                complement={complement ? complement.foodSupplementPresent : false}
                complementType={complement ? complement.nameFoodSupplement : null} 
                complementMethode={complement ? complement.method : null} 
                complementAmount={complement ? complement.amount : null} 
            />
        );
    });
    
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" />
                <p className={styles.babyName}>{baby.name}</p>
                <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
            </div>

            {/* body */}
            <div>
                {data}
            </div>
        </div>
    )

}

export default DetailAlimentation;
