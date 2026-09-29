import { useNavigate } from "react-router-dom";
import "./style.css";
import HomeIcon from "../../components/icons/HomeIcon";


export default function NotFoundPage() {

    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-text">
                    <div className="not-found-code">
                        404
                    </div>
                    <h1>
                        Страница не найдена
                    </h1>
                    <p>
                        Запрашиваемая страница не существует,
                        была удалена или перенесена на другой адрес.
                    </p>
                </div>

               <button
                  className="return-home-btn"
                  onClick={() => navigate("/rooms")}
                >

                  <HomeIcon/>

                  <span>
                        Вернуться к переговорным
                  </span>

               </button>
            </div>
      </div>
   );
}