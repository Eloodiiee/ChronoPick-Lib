import React, { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import "./DatePicker.css"

// Props pour le composant DatePicker, incluant des options comme la date sélectionnée,
// un callback pour le changement de date, un filtre pour les dates, et une option pour désactiver les dates futures.
export interface DatePickerProps {
    selectedDate?: Date
    onDateChange?: (date: Date) => void
    filterDate?: (date: Date) => boolean
    disableFuture?: boolean
}

// Composant principal DatePicker
export const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange, filterDate, disableFuture }) => {
    // État pour stocker la date actuelle, le mois et l'année sélectionnés, ainsi que l'affichage du calendrier et des dropdowns.
    const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date())
    const [currentMonth, setCurrentMonth] = useState<number>(currentDate.getMonth())
    const [currentYear, setCurrentYear] = useState<number>(currentDate.getFullYear())
    const [showCalendar, setShowCalendar] = useState<boolean>(false)
    const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false)
    const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false)
    const [inputDate, setInputDate] = useState<string>("") // État pour la date saisie par l'utilisateur

    const today = new Date() // Stocke la date du jour

    // Ref pour détecter les clics en dehors du calendrier
    const calendarRef = useRef<HTMLDivElement>(null)

    // Hook useEffect pour fermer le calendrier lorsqu'un clic se produit en dehors de celui-ci
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
                setShowMonthDropdown(false) // Ferme le dropdown du mois
                setShowYearDropdown(false) // Ferme le dropdown de l'année
            }
        }

        // Ajoute un listener global sur les clics
        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [calendarRef])

    // Gestion du clic sur le champ de date pour afficher/masquer le calendrier
    const handleDateClick = (event: React.MouseEvent) => {
        event.stopPropagation() // Empêche la propagation de l'événement pour éviter la fermeture immédiate
        setShowCalendar(!showCalendar) // Bascule l'état du calendrier
        setShowMonthDropdown(false)
        setShowYearDropdown(false)
    }

    // Gestion de la touche "Entrée" pour valider la date saisie
    const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const parsedDate = parseDateFromString(inputDate)
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

    // Fonction pour formater la date au format "DD/MM/YYYY"
    const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0") // Les mois commencent à 0, donc on ajoute 1
        const year = date.getFullYear()
        return `${day}/${month}/${year}` // Retourne la date au format "DD/MM/YYYY"
    }

    // Fonction pour transformer une chaîne de caractères en date au format "DD/MM/YYYY"
    const parseDateFromString = (dateString: string): Date | null => {
        const [day, month, year] = dateString.split("/").map(Number)
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month - 1, day) // Crée une nouvelle date à partir de la chaîne formatée
        }
        return null // Retourne null si la date est invalide
    }

    // Fonction pour gérer le changement de date (via la sélection dans le calendrier)
    const handleDateChange = (newDate: Date) => {
        if (disableFuture && newDate > today) {
            return // Empêche la sélection de dates futures si l'option est activée
        }
        setCurrentDate(newDate)
        setInputDate(formatDate(newDate)) // Met à jour le champ de saisie avec la date au bon format
        setShowCalendar(false)
        setShowMonthDropdown(false)
        setShowYearDropdown(false)
        if (onDateChange) {
            onDateChange(newDate)
        }
    }

    // Gestion du changement de mois via le dropdown
    const handleMonthChange = (month: number) => {
        if (disableFuture && (currentYear > today.getFullYear() || (currentYear === today.getFullYear() && month > today.getMonth()))) {
            return // Empêche la sélection de mois futurs
        }
        setCurrentMonth(month)
        setShowMonthDropdown(false) // Ferme le dropdown après sélection
    }

    // Gestion du changement d'année via le dropdown
    const handleYearChange = (year: number) => {
        if (disableFuture && year > today.getFullYear()) {
            return // Empêche la sélection d'années futures
        }
        setCurrentYear(year)
        setShowYearDropdown(false) // Ferme le dropdown après sélection
    }

    // Gestion de la navigation au mois précédent
    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11)
            setCurrentYear(currentYear - 1) // Si on est en janvier, on passe à décembre de l'année précédente
        } else {
            setCurrentMonth(currentMonth - 1)
        }
    }

    // Gestion de la navigation au mois suivant
    const handleNextMonth = () => {
        if (disableFuture && currentYear === today.getFullYear() && currentMonth >= today.getMonth()) {
            return // Empêche de passer au mois suivant si la date est dans le futur
        }
        if (currentMonth === 11) {
            setCurrentMonth(0)
            setCurrentYear(currentYear + 1) // Si on est en décembre, on passe à janvier de l'année suivante
        } else {
            setCurrentMonth(currentMonth + 1)
        }
    }

    // Gestion de la navigation à l'année précédente
    const handlePreviousYear = () => {
        setCurrentYear(currentYear - 1)
    }

    // Gestion de la navigation à l'année suivante
    const handleNextYear = () => {
        if (disableFuture && currentYear >= today.getFullYear()) {
            return // Empêche de passer à une année future
        }
        setCurrentYear(currentYear + 1)
    }

    // Gestion de la saisie de la date dans le champ texte avec ajout/suppression automatique des slashes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value

        // Gestion de la suppression d'un slash si l'utilisateur supprime un caractère
        if (value.length < inputDate.length) {
            if (inputDate.endsWith("/") && value.length === inputDate.length - 1) {
                value = value.slice(0, -1) // Supprime également le slash
            }
        }

        // Supprime les caractères non numériques
        value = value.replace(/\D/g, "")

        // Ajoute les slashes automatiquement après le jour et le mois
        if (value.length >= 2) {
            value = value.slice(0, 2) + "/" + value.slice(2)
        }
        if (value.length >= 5) {
            value = value.slice(0, 5) + "/" + value.slice(5)
        }
        if (value.length > 10) {
            value = value.slice(0, 10) // Limite la longueur à 10 caractères maximum
        }

        setInputDate(value)

        // Si la date est complète, on la parse et on la met à jour
        if (value.length === 10) {
            const parsedDate = parseDateFromString(value)
            if (parsedDate && (!disableFuture || parsedDate <= today)) {
                setCurrentDate(parsedDate)
                setCurrentMonth(parsedDate.getMonth())
                setCurrentYear(parsedDate.getFullYear())
                if (onDateChange) {
                    onDateChange(parsedDate)
                }
            }
        }
    }

    // Fonction pour générer les jours du mois sélectionné
    const generateCalendar = (year: number, month: number): (Date | null)[] => {
        const firstDay = new Date(year, month, 1).getDay() // Premier jour du mois
        const daysInMonth = new Date(year, month + 1, 0).getDate() // Nombre de jours dans le mois
        const calendar: Array<Date | null> = []

        // Ajoute des jours "vides" pour aligner le premier jour correctement
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

    // Désactive les flèches si les dates futures sont désactivées
    const isNextMonthDisabled = disableFuture && currentYear === today.getFullYear() && currentMonth >= today.getMonth()
    const isNextYearDisabled = disableFuture && currentYear >= today.getFullYear()

    return (
        <div style={{ display: "inline-block", fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
            {/* Bouton pour afficher/masquer le calendrier */}
            <div onClick={handleDateClick} className="date-picker-button">
                <span>{formatDate(currentDate)}</span> {/* Affichage de la date formatée */}
                <FontAwesomeIcon icon={faCalendar} className="date-picker-icon" />
            </div>

            {/* Affichage du calendrier uniquement si l'état showCalendar est vrai */}
            {showCalendar && (
                <div ref={calendarRef} className="date-picker-calendar">
                    <div className="date-picker-controls">
                        {/* Navigation mois */}
                        <div className="date-picker-navigation">
                            <button onClick={handlePreviousMonth}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <div className="dropdown">
                                <div className="dropdown-button" onClick={() => setShowMonthDropdown(!showMonthDropdown)}>
                                    {["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"][currentMonth]}
                                </div>
                                {/* Dropdown pour les mois */}
                                {showMonthDropdown && (
                                    <ul className="dropdown-menu dropdown-menu-scrollable">
                                        {["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleMonthChange(index)}
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

                        {/* Navigation année */}
                        <div className="date-picker-navigation">
                            <button onClick={handlePreviousYear}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <div className="dropdown">
                                <div className="dropdown-button" onClick={() => setShowYearDropdown(!showYearDropdown)}>
                                    {currentYear}
                                </div>
                                {/* Dropdown pour les années */}
                                {showYearDropdown && (
                                    <ul className="dropdown-menu dropdown-menu-scrollable">
                                        {Array.from({ length: 100 }, (_, i) => currentYear - 50 + i).map((year) => (
                                            <li key={year} onClick={() => handleYearChange(year)} className={disableFuture && year > today.getFullYear() ? "disabled" : ""}>
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
                            placeholder="DD/MM/YYYY"
                            value={inputDate}
                            onChange={handleInputChange}
                            onKeyUp={handleInputKeyPress} // Valide la date en appuyant sur Entrée
                            style={{ padding: "8px", fontSize: "14px", width: "150px" }}
                            maxLength={10} // Limite à 10 caractères pour correspondre au format "DD/MM/YYYY"
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

export default DatePicker /*  */
