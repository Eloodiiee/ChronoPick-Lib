import React, { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import "./style.css"

// Interface définissant les propriétés (props) attendues par le composant DatePicker
export interface DatePickerProps {
    selectedDate?: Date // Date sélectionnée par défaut
    onDateChange?: (date: Date) => void // Callback pour déclencher un changement de date
    filterDate?: (date: Date) => boolean // Fonction permettant de filtrer les dates non sélectionnables
    disableFuture?: boolean // Indique si les dates futures doivent être désactivées
    dateFormat?: string // Format de date personnalisé (par défaut 'dd/mm/yyyy')
}

// Fonction utilitaire pour formater une date selon le format spécifié dans les props
const formatDate = (date: Date, format: string = "dd/mm/yyyy"): string => {
    const day = String(date.getDate()).padStart(2, "0") // Formate le jour avec un zéro initial
    const month = String(date.getMonth() + 1).padStart(2, "0") // Formate le mois avec un zéro initial
    const year = date.getFullYear()

    // Choisit le format correct en fonction de l'option passée via le prop dateFormat
    switch (format.toLowerCase()) {
        case "yyyy/mm/dd":
            return `${year}/${month}/${day}`
        case "mm/dd/yyyy":
            return `${month}/${day}/${year}`
        case "yyyy-dd-mm":
            return `${year}-${day}-${month}`
        case "dd/mm/yyyy":
        default:
            return `${day}/${month}/${year}` // Format par défaut "dd/mm/yyyy"
    }
}

// Composant principal DatePicker, contrôlant l'affichage et l'interaction du calendrier
export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange, filterDate, disableFuture, dateFormat = "dd/mm/yyyy" }) => {
    // États gérant la date sélectionnée, mois, année, et l'affichage des éléments du calendrier
    const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date()) // Date actuelle
    const [currentMonth, setCurrentMonth] = useState<number>(currentDate.getMonth()) // Mois actuel
    const [currentYear, setCurrentYear] = useState<number>(currentDate.getFullYear()) // Année actuelle
    const [showCalendar, setShowCalendar] = useState<boolean>(false) // Contrôle la visibilité du calendrier
    const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false) // Contrôle la visibilité du sélecteur de mois
    const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false) // Contrôle la visibilité du sélecteur d'année
    const [inputDate, setInputDate] = useState<string>(formatDate(currentDate, dateFormat)) // Date affichée dans le champ input

    const today = new Date() // Date du jour

    // Ref pour détecter les clics en dehors du calendrier et fermer les dropdowns
    const calendarRef = useRef<HTMLDivElement>(null)
    const monthDropdownRef = useRef<HTMLDivElement>(null)
    const yearDropdownRef = useRef<HTMLDivElement>(null)

    // useEffect permettant de gérer les clics en dehors du calendrier pour le fermer
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Vérifie si le clic est en dehors du calendrier, ou des dropdowns
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target as Node) &&
                monthDropdownRef.current &&
                !monthDropdownRef.current.contains(event.target as Node) &&
                yearDropdownRef.current &&
                !yearDropdownRef.current.contains(event.target as Node)
            ) {
                setShowCalendar(false) // Ferme le calendrier
                setShowMonthDropdown(false) // Ferme le dropdown du mois
                setShowYearDropdown(false) // Ferme le dropdown de l'année
            }
        }

        // Ajoute un listener pour détecter les clics à l'extérieur
        document.addEventListener("click", handleClickOutside)

        return () => {
            // Nettoie le listener lors du démontage du composant
            document.removeEventListener("click", handleClickOutside)
        }
    }, [calendarRef, monthDropdownRef, yearDropdownRef])

    // Gère l'affichage/masquage du calendrier lors d'un clic sur le champ de date
    const handleDateClick = (event: React.MouseEvent) => {
        event.stopPropagation() // Empêche la fermeture immédiate après l'ouverture
        setShowCalendar(!showCalendar) // Inverse l'état de visibilité du calendrier
        setShowMonthDropdown(false) // Ferme le dropdown du mois
        setShowYearDropdown(false) // Ferme le dropdown de l'année
    }

    // Gère la validation de la date saisie lors de l'appui sur la touche "Entrée"
    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault() // Empêche la soumission du formulaire par Enter
            const parsedDate = parseDateFromString(inputDate, dateFormat)
            console.log("Date après parsing :", parsedDate) // Ajout du log

            if (parsedDate && (!disableFuture || parsedDate <= today)) {
                setCurrentDate(parsedDate)
                setCurrentMonth(parsedDate.getMonth())
                setCurrentYear(parsedDate.getFullYear())
                setShowCalendar(false) // Ferme le calendrier après validation
                if (onDateChange) {
                    onDateChange(parsedDate)
                }
            }
        }
    }

    // Fonction pour transformer une chaîne de caractères en date selon le format spécifié
    const parseDateFromString = (dateString: string, format: string = "dd/mm/yyyy"): Date | null => {
        let day: number, month: number, year: number

        switch (format.toLowerCase()) {
            case "yyyy/mm/dd":
                ;[year, month, day] = dateString.split("/").map(Number)
                break
            case "mm/dd/yyyy":
                ;[month, day, year] = dateString.split("/").map(Number)
                break
            case "dd/mm/yyyy":
            default:
                ;[day, month, year] = dateString.split("/").map(Number)
                break
        }

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month - 1, day) // Crée une nouvelle date
        }
        return null // Retourne null si la date est invalide
    }

    // Gère le changement de la date sélectionnée dans le calendrier
    const handleDateChange = (newDate: Date) => {
        if (disableFuture && newDate > today) {
            return // Si l'option disableFuture est activée, empêche la sélection de dates futures
        }
        setCurrentDate(newDate)
        setInputDate(formatDate(newDate, dateFormat)) // Met à jour la date dans le champ input selon le format
        setShowCalendar(false)
        setShowMonthDropdown(false)
        setShowYearDropdown(false)
        if (onDateChange) {
            onDateChange(newDate) // Appelle le callback de changement de date
        }
    }

    // Gestion du changement de mois via le dropdown
    const handleMonthChange = (month: number, event: React.MouseEvent) => {
        event.stopPropagation() // Empêche la fermeture du calendrier
        if (disableFuture && (currentYear > today.getFullYear() || (currentYear === today.getFullYear() && month > today.getMonth()))) {
            return // Empêche la sélection de mois futurs
        }
        const updatedDate = new Date(currentYear, month, currentDate.getDate())
        setCurrentMonth(month)
        setCurrentDate(updatedDate)
        setInputDate(formatDate(updatedDate, dateFormat)) // Met à jour l'affichage de la date
        setShowMonthDropdown(false) // Ferme le dropdown après sélection
    }

    // Gestion du changement d'année via le dropdown
    const handleYearChange = (year: number, event: React.MouseEvent) => {
        event.stopPropagation() // Empêche la fermeture du calendrier
        if (disableFuture && year > today.getFullYear()) {
            return // Empêche la sélection d'années futures
        }
        const updatedDate = new Date(year, currentMonth, currentDate.getDate())
        setCurrentYear(year)
        setCurrentDate(updatedDate)
        setInputDate(formatDate(updatedDate, dateFormat)) // Met à jour l'affichage de la date
        setShowYearDropdown(false) // Ferme le dropdown après sélection
    }

    // Gestion de la navigation au mois précédent
    const handlePreviousMonth = () => {
        let newMonth = currentMonth - 1
        let newYear = currentYear

        if (newMonth < 0) {
            newMonth = 11
            newYear -= 1
        }

        const updatedDate = new Date(newYear, newMonth, currentDate.getDate())
        setCurrentMonth(newMonth)
        setCurrentYear(newYear)
        setCurrentDate(updatedDate)
        setInputDate(formatDate(updatedDate, dateFormat)) // Met à jour l'affichage de la date
    }

    // Gestion de la navigation au mois suivant
    const handleNextMonth = () => {
        let newMonth = currentMonth + 1
        let newYear = currentYear

        if (newMonth > 11) {
            newMonth = 0
            newYear += 1
        }

        if (disableFuture && newYear === today.getFullYear() && newMonth > today.getMonth()) {
            return // Empêche la sélection de mois futurs
        }

        const updatedDate = new Date(newYear, newMonth, currentDate.getDate())
        setCurrentMonth(newMonth)
        setCurrentYear(newYear)
        setCurrentDate(updatedDate)
        setInputDate(formatDate(updatedDate, dateFormat)) // Met à jour l'affichage de la date
    }

    // Fonction pour passer à l'année précédente
    const handlePreviousYear = () => {
        let newYear = currentYear - 1
        const updatedDate = new Date(newYear, currentMonth, currentDate.getDate())
        setCurrentYear(currentYear - 1)
        setCurrentDate(updatedDate)
        setInputDate(formatDate(updatedDate, dateFormat)) // Met à jour l'affichage de la date
    }

    // Fonction pour passer à l'année suivante
    const handleNextYear = () => {
        if (disableFuture && currentYear >= today.getFullYear()) {
            return // Empêche de passer à une année future
        }
        let newYear = currentYear + 1
        const updatedDate = new Date(newYear, currentMonth, currentDate.getDate())
        setCurrentYear(currentYear + 1)
        setCurrentDate(updatedDate)
        setInputDate(formatDate(updatedDate, dateFormat)) // Met à jour l'affichage de la date
    }

    // Gestion de la saisie de la date dans le champ texte avec ajout/suppression automatique des slashes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, "") // Supprime les caractères non numériques
        const format = dateFormat.toLowerCase()

        // Sauvegarde de la position du curseur pour maintenir le comportement naturel lors de la suppression
        const inputElement = e.target
        let cursorPosition = inputElement.selectionStart ?? 0 // Sauvegarde de la position du curseur

        // Gestion de l'ajout des slashes au bon moment en fonction du format
        let formattedValue = ""
        let actualCursorPosition = cursorPosition

        // Format dd/mm/yyyy
        if (format === "dd/mm/yyyy") {
            if (value.length > 0) {
                formattedValue += value.slice(0, 2) // Jour
                if (value.length >= 3) {
                    formattedValue += "/" + value.slice(2, 4) // Mois
                    if (cursorPosition >= 3) actualCursorPosition++ // Ajustement du curseur après le premier slash
                }
                if (value.length >= 5) {
                    formattedValue += "/" + value.slice(4, 8) // Année
                    if (cursorPosition >= 6) actualCursorPosition++ // Ajustement du curseur après le deuxième slash
                }
            }
        }

        // Format mm/dd/yyyy
        else if (format === "mm/dd/yyyy") {
            if (value.length > 0) {
                formattedValue += value.slice(0, 2) // Mois
                if (value.length >= 3) {
                    formattedValue += "/" + value.slice(2, 4) // Jour
                    if (cursorPosition >= 3) actualCursorPosition++ // Ajustement du curseur après le premier slash
                }
                if (value.length >= 5) {
                    formattedValue += "/" + value.slice(4, 8) // Année
                    if (cursorPosition >= 6) actualCursorPosition++ // Ajustement du curseur après le deuxième slash
                }
            }
        }

        // Format yyyy/mm/dd
        else if (format === "yyyy/mm/dd") {
            if (value.length > 0) {
                formattedValue += value.slice(0, 4) // Année
                if (value.length >= 5) {
                    formattedValue += "/" + value.slice(4, 6) // Mois
                    if (cursorPosition >= 5) actualCursorPosition++ // Ajustement du curseur après le premier slash
                }
                if (value.length >= 7) {
                    formattedValue += "/" + value.slice(6, 8) // Jour
                    if (cursorPosition >= 8) actualCursorPosition++ // Ajustement du curseur après le deuxième slash
                }
            }
        }

        // Mise à jour de l'état avec la nouvelle valeur formatée
        setInputDate(formattedValue)

        // Restaurer la position du curseur après la mise à jour
        setTimeout(() => {
            inputElement.setSelectionRange(actualCursorPosition, actualCursorPosition) // Restaurer la position exacte du curseur
        }, 0)

        // Si la date est complète, on la parse et on la met à jour
        if (formattedValue.length === format.length) {
            const parsedDate = parseDateFromString(formattedValue, dateFormat)
            if (parsedDate && (!disableFuture || parsedDate <= new Date())) {
                setCurrentDate(parsedDate)
                if (onDateChange) {
                    onDateChange(parsedDate) // Déclenche l'événement de changement de date
                }
            }
        }
    }

    // Fonction pour générer les jours du mois sélectionné
    const generateCalendar = (year: number, month: number): (Date | null)[] => {
        const firstDay = new Date(year, month, 1).getDay() // Premier jour du mois
        const daysInMonth = new Date(year, month + 1, 0).getDate() // Nombre de jours dans le mois
        const calendar: Array<Date | null> = []

        // Ajoute des jours "vides" pour aligner correctement les jours du mois dans le calendrier
        for (let i = 0; i < firstDay; i++) {
            calendar.push(null) // Placeholders pour les jours avant le 1er du mois
        }

        // Ajoute les jours réels du mois
        for (let i = 1; i <= daysInMonth; i++) {
            calendar.push(new Date(year, month, i))
        }

        return calendar // Retourne le tableau des jours du mois
    }

    // Génération du calendrier pour le mois et l'année actuels
    const days = generateCalendar(currentYear, currentMonth)

    // Désactive les flèches de navigation si les dates futures sont désactivées
    const isNextMonthDisabled = disableFuture && currentYear === today.getFullYear() && currentMonth >= today.getMonth()
    const isNextYearDisabled = disableFuture && currentYear >= today.getFullYear()

    return (
        <div style={{ display: "inline-block", fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
            {/* Bouton pour afficher/masquer le calendrier */}
            <div onClick={handleDateClick} className="date-picker-button">
                <span>{formatDate(currentDate, dateFormat)}</span> {/* Affichage formaté de la date */}
                <FontAwesomeIcon icon={faCalendar} className="date-picker-icon" />
            </div>

            {/* Affichage du calendrier uniquement si showCalendar est vrai */}
            {showCalendar && (
                <div ref={calendarRef} className="date-picker-calendar">
                    <div className="date-picker-controls">
                        {/* Navigation des mois */}
                        <div className="date-picker-navigation">
                            <button onClick={handlePreviousMonth}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <div className="dropdown-datepicker ">
                                <div className="dropdown-button" ref={monthDropdownRef} onClick={() => setShowMonthDropdown(!showMonthDropdown)}>
                                    {["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"][currentMonth]}
                                </div>
                                {/* Dropdown pour les mois */}
                                {showMonthDropdown && (
                                    <ul className="dropdown-menu dropdown-menu-scrollable">
                                        {["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
                                            <li
                                                key={index}
                                                onClick={(event) => handleMonthChange(index, event)}
                                                className={disableFuture && currentYear === today.getFullYear() && index > today.getMonth() ? "disabled" : ""}
                                            >
                                                {month}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button onClick={handleNextMonth} disabled={isNextMonthDisabled} className={isNextMonthDisabled ? "disabled" : ""}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>

                        {/* Navigation des années */}
                        <div className="date-picker-navigation">
                            <button onClick={handlePreviousYear}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <div className="dropdown-datepicker">
                                <div className="dropdown-button" ref={yearDropdownRef} onClick={() => setShowYearDropdown(!showYearDropdown)}>
                                    {currentYear}
                                </div>
                                {/* Dropdown pour les années */}
                                {showYearDropdown && (
                                    <ul className="dropdown-menu dropdown-menu-scrollable">
                                        {Array.from({ length: 100 }, (_, i) => currentYear - 50 + i).map((year) => (
                                            <li key={year} onClick={(event) => handleYearChange(year, event)} className={disableFuture && year > today.getFullYear() ? "disabled" : ""}>
                                                {year}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button onClick={handleNextYear} disabled={isNextYearDisabled} className={isNextYearDisabled ? "disabled" : ""}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    </div>

                    {/* Champ de saisie manuel pour la date */}
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                        <input
                            type="text"
                            placeholder={dateFormat.toUpperCase()} // Placeholde modifié en fonction du format
                            value={inputDate}
                            onChange={handleInputChange}
                            onKeyUp={handleInputKeyPress} // Valide la date en appuyant sur Entrée
                            style={{ padding: "8px", fontSize: "14px", width: "150px" }}
                            maxLength={dateFormat.length + 2} // Longueur maximale en fonction du format (avec 2 séparateurs "/")
                        />
                    </div>

                    {/* Grille des jours du mois */}
                    <div className="date-picker-grid">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                            <div key={index} className="day">
                                {day} {/* Affichage des jours de la semaine */}
                            </div>
                        ))}
                        {days.map((date, index) => (
                            <div
                                key={index}
                                onClick={() => date && (!filterDate || filterDate(date)) && handleDateChange(date)}
                                className={`date ${date && (!filterDate || filterDate(date)) ? "enabled" : "disabled"}`} // Désactive les dates filtrées
                            >
                                {date ? date.getDate() : ""}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default DatePicker
