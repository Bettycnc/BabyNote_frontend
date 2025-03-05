import { useState } from "react";
import styles from "../styles/ConnexionPro.module.css";
import Link from "next/link";


const addPhoto = () => {
    const CameraCapture = () => {
        const [imageSrc, setImageSrc] = useState(null);
        const videoRef = useRef(null);
        const canvasRef = useRef(null);
      
        // Demander l'accès à la caméra
        useEffect(() => {
          const startVideo = async () => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
            } catch (err) {
              console.error('Erreur d\'accès à la caméra', err);
            }
          };
      
          startVideo();
      
          // Arrêter le flux vidéo quand le composant est démonté
          return () => {
            if (videoRef.current && videoRef.current.srcObject) {
              const stream = videoRef.current.srcObject;
              const tracks = stream.getTracks();
              tracks.forEach(track => track.stop());
            }
          };
        }, []);
      
        // Capturer l'image depuis le flux vidéo
        const capturePhoto = () => {
          const canvas = canvasRef.current;
          const video = videoRef.current;
      
          // Dessiner l'image vidéo sur un canvas
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
          // Convertir l'image en format base64 et la stocker dans le state
          setImageSrc(canvas.toDataURL('image/png'));
        };
      
        return (
          <div>
            <h1>Prendre une photo</h1>
            <video ref={videoRef} autoPlay></video>
            <button onClick={capturePhoto}>Capturez</button>
            {imageSrc && (
              <div>
                <h2>Votre Photo :</h2>
                <img src={imageSrc} alt="Captured" />
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>
        );
      };





return (
<>
<button onClick={CameraCapture}>
Prendre une photo
</button>


<button>
Ajouter une photo depuis la galerie
</button>
</>

)







}

export default addPhoto;