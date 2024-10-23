import "./App.css"
import DatePicker from "./lib"
import logo from "./assets/images/Logo_ChronoPick.png"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaste } from "@fortawesome/free-solid-svg-icons"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs"

function App() {
    const [firstCopy, setFirstCopy] = useState(false)
    const [secondCopy, setSecondCopy] = useState(false)
    const [isFirstOpen, setIsFirstOpen] = useState(false)
    const [isSecondOpen, setIsSecondOpen] = useState(false)

    const handleFirstCode = () => {
        setIsFirstOpen(!isFirstOpen)
    }
    const handleSecondCode = () => {
        setIsSecondOpen(!isSecondOpen)
    }

    const noWeekEndDatePicker = "<DatePicker filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} />"
    const noFutureDatesDatePicker = "<DatePicker selectedDate={new Date()} disableFuture={true} />"
    return (
        <>
            <nav className="navbar">
                <div className="logo-container">
                    <img src={logo} alt="ChronoPick Logo" className="logo" />
                </div>
                <h1>ChronoPick</h1>
            </nav>
            <section>
                <h2>Custom Date Picker</h2>

                <div className="description">
                    This custom Date Picker includes several features such as:
                    <ul>
                        <li>A searchbar to write down a date</li>
                        <li>Dropdowns & arrows to select the month and year</li>
                        <li>Excluding days of a given week</li>
                        <li>Exclude all dates after today</li>
                    </ul>
                </div>
                <div className="content">
                    <div className="appContainer">
                        <h2>Exclude Weekends</h2>

                        <div className="datePickerContainer">
                            <DatePicker filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} />
                        </div>
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
                                                navigator.clipboard.writeText(noWeekEndDatePicker)
                                                setFirstCopy(true)
                                                setTimeout(() => {
                                                    setFirstCopy(false)
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
                                <SyntaxHighlighter language="jsx" style={atomOneDarkReasonable}>
                                    {noWeekEndDatePicker}
                                </SyntaxHighlighter>
                            </div>
                        )}
                        <div className="textContainer">
                            <p>On this datepicker, all weekends are blocked</p>
                            <p>So you can only select week days</p>
                        </div>
                        <p className="showCodeBtn" onClick={handleFirstCode}>
                            Show code
                        </p>
                    </div>
                </div>
                <div className="content">
                    <div className="appContainer">
                        <h2>Disable Future Dates</h2>
                        <div className="datePickerContainer">
                            <DatePicker selectedDate={new Date()} disableFuture={true} />
                        </div>
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
                                                navigator.clipboard.writeText(noFutureDatesDatePicker)
                                                setSecondCopy(true)
                                                setTimeout(() => {
                                                    setSecondCopy(false)
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
                                <SyntaxHighlighter language="javascript" style={atomOneDarkReasonable}>
                                    {noFutureDatesDatePicker}
                                </SyntaxHighlighter>
                            </div>
                        )}
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
