import "./App.css"
import DatePicker from "./lib"
import logo from "./assets/images/Logo_ChronoPick.png"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowDownWideShort, faCalendarTimes, faBan, faCog, faCheck, faPaste } from "@fortawesome/free-solid-svg-icons"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs"

function App() {
    // Déclaration des états locaux pour gérer la copie de code et l'ouverture/fermeture des sections
    const [firstCopy, setFirstCopy] = useState(false)
    const [secondCopy, setSecondCopy] = useState(false)
    const [isFirstOpen, setIsFirstOpen] = useState(false)
    const [isSecondOpen, setIsSecondOpen] = useState(false)
    const [date, setDate] = useState(new Date()) // État pour stocker la date actuelle

    // Fonction utilitaire pour formater une date en fonction du format spécifié
    const formatDate = (date, format = "dd/mm/yyyy") => {
        if (!date) return "" // Retourne une chaîne vide si aucune date n'est fournie
        const day = String(date.getDate()).padStart(2, "0") // Formate le jour avec un zéro initial si nécessaire
        const month = String(date.getMonth() + 1).padStart(2, "0") // Formate le mois (en ajoutant 1 car Janvier = 0 en JS)
        const year = date.getFullYear()

        // Utilise le format spécifié pour organiser la date
        switch (format.toLowerCase()) {
            case "yyyy/mm/dd":
                return `${year}/${month}/${day}`
            case "mm/dd/yyyy":
                return `${month}/${day}/${year}`
            case "yyyy-dd-mm":
                return `${year}-${day}-${month}`
            case "dd/mm/yyyy":
            default:
                return `${day}/${month}/${year}` // Format par défaut
        }
    }

    // Fonction appelée lors du changement de date dans le DatePicker
    const handleDateChange = (newDate, format) => {
        setDate(newDate) // Met à jour l'état avec la nouvelle date sélectionnée
        console.log("Nouvelle date formatée :", formatDate(newDate, format)) // Affiche la date formatée dans la console
    }

    // Gère l'ouverture/fermeture de la section "Exclude Weekends"
    const handleFirstCode = () => {
        setIsFirstOpen(!isFirstOpen)
    }

    // Gère l'ouverture/fermeture de la section "Disable Future Dates"
    const handleSecondCode = () => {
        setIsSecondOpen(!isSecondOpen)
    }

    // JSX code pour afficher un exemple du DatePicker qui exclut les week-ends
    const noWeekEndDatePicker = `<DatePicker filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} onDateChange={(newDate) => handleDateChange(newDate, "yyyy/mm/dd")} dateFormat="yyyy/mm/dd" />`

    // JSX code pour afficher un exemple du DatePicker qui désactive les dates futures
    const noFutureDatesDatePicker = "<DatePicker selectedDate={new Date()} disableFuture={true} onDateChange={handleDateChange} />"

    // Hook useEffect pour afficher la date par défaut au chargement de l'application
    useEffect(() => {
        console.log("Date par défaut :", formatDate(date)) // Affiche la date par défaut dans la console
    }, [date])

    return (
        <>
            {/* Barre de navigation avec logo et titre */}
            <nav className="navbar">
                <div className="logo-container">
                    <img src={logo} alt="ChronoPick Logo" className="logo" />
                </div>
                <h1>ChronoPick</h1>
            </nav>
            <section>
                <h2 className="title">Custom Date Picker</h2>

                {/* Section description avec une liste des fonctionnalités */}
                <div className="description">
                    <p>This custom Date Picker includes several features such as:</p>
                    <ul>
                        <li>
                            <FontAwesomeIcon icon={faSearch} /> A searchbar to write down a date
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faArrowDownWideShort} /> Dropdowns & arrows to select the month and year
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faCalendarTimes} /> Excluding days of a given week
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faBan} /> Exclude all dates after today
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faCog} /> Change date format
                        </li>
                    </ul>
                </div>

                {/* Première section "Exclude Weekends" */}
                <div className="content">
                    <div className="appContainer">
                        <h2>Exclude Weekends</h2>

                        {/* Instance du DatePicker excluant les week-ends */}
                        <div className="datePickerContainer">
                            <DatePicker filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} onDateChange={(newDate) => handleDateChange(newDate, "yyyy/mm/dd")} dateFormat="yyyy/mm/dd" />
                        </div>

                        {/* Affichage du code si isFirstOpen est vrai */}
                        {isFirstOpen && (
                            <div className={`codeContainer ${isFirstOpen ? "open" : ""}`}>
                                <div className="codeContainerHeader">
                                    <span className="codeContainerChild">ChronoPick - excluding weekends</span>
                                    {firstCopy ? (
                                        <button className="codeContainerChild">
                                            <span>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </span>
                                            Copied!
                                        </button>
                                    ) : (
                                        <button
                                            className="codeContainerChild"
                                            onClick={() => {
                                                navigator.clipboard.writeText(noWeekEndDatePicker) // Copie le code JSX dans le presse-papiers
                                                setFirstCopy(true)
                                                setTimeout(() => {
                                                    setFirstCopy(false) // Réinitialise l'état après 3 secondes
                                                }, 3000)
                                            }}
                                        >
                                            <span>
                                                <FontAwesomeIcon icon={faPaste} />
                                            </span>
                                            Copy code
                                        </button>
                                    )}
                                </div>

                                {/* Affichage du code source formaté avec SyntaxHighlighter */}
                                <SyntaxHighlighter language="jsx" style={atomOneDarkReasonable}>
                                    {noWeekEndDatePicker}
                                </SyntaxHighlighter>
                            </div>
                        )}

                        {/* Description du comportement du DatePicker */}
                        <div className="textContainer">
                            <p>On this datepicker, all weekends are blocked</p>
                            <p>So you can only select week days</p>
                            <p>On this datepicker, the date format is `yyyy/mm/dd`</p>
                        </div>
                        <p className="showCodeBtn" onClick={handleFirstCode}>
                            Show code
                        </p>
                    </div>
                </div>

                {/* Deuxième section "Disable Future Dates" */}
                <div className="content">
                    <div className="appContainer">
                        <h2>Disable Future Dates</h2>

                        {/* Instance du DatePicker désactivant les dates futures */}
                        <div className="datePickerContainer">
                            <DatePicker selectedDate={new Date()} disableFuture={true} onDateChange={handleDateChange} />
                        </div>

                        {/* Affichage du code si isSecondOpen est vrai */}
                        {isSecondOpen && (
                            <div className={`codeContainer ${isSecondOpen ? "open" : ""}`}>
                                <div className="codeContainerHeader">
                                    <span className="codeContainerChild">ChronoPick - excluding weekends</span>
                                    {secondCopy ? (
                                        <button className="codeContainerChild">
                                            <span>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </span>
                                            Copied!
                                        </button>
                                    ) : (
                                        <button
                                            className="codeContainerChild"
                                            onClick={() => {
                                                navigator.clipboard.writeText(noFutureDatesDatePicker) // Copie le code JSX dans le presse-papiers
                                                setSecondCopy(true)
                                                setTimeout(() => {
                                                    setSecondCopy(false) // Réinitialise l'état après 3 secondes
                                                }, 3000)
                                            }}
                                        >
                                            <span>
                                                <FontAwesomeIcon icon={faPaste} />
                                            </span>
                                            Copy code
                                        </button>
                                    )}
                                </div>

                                {/* Affichage du code source formaté avec SyntaxHighlighter */}
                                <SyntaxHighlighter language="javascript" style={atomOneDarkReasonable}>
                                    {noFutureDatesDatePicker}
                                </SyntaxHighlighter>
                            </div>
                        )}

                        {/* Description du comportement du DatePicker */}
                        <div className="textContainer">
                            <p>All dates after today are disabled</p>
                            <p>You may only choose past dates and today</p>
                        </div>
                        <p className="showCodeBtn" onClick={handleSecondCode}>
                            Show code
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default App
