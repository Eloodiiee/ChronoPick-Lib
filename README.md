# ChronoPick - Custom Date Picker

`ChronoPick` is a **React Date Picker** component that offers advanced features such as excluding specific dates, customizable date formats, and intuitive navigation using dropdowns and arrows.

## Features

-   **Manual Date Input**: Input a date through a text field.
-   **Month and Year Selector**: Use dropdowns and arrows for easy navigation between months and years.
-   **Exclude Specific Dates**: Exclude weekends, holidays, or any custom dates.
-   **Disable Future Dates**: Prevent the selection of future dates.
-   **Custom Date Formats**: Supports multiple date formats like `dd/mm/yyyy`, `yyyy/mm/dd`, and `mm/dd/yyyy`.

## Installation

To install `ChronoPick` in your project, run:

```bash
npm install chronopick-datepicker
```

## Usage

To use `ChronoPick` in your React project:

```jsx
import DatePicker from "chronopick-datepicker"
import "chronopick-datepicker/dist/DatePicker.css"

const App = () => {
    const handleDateChange = (newDate) => {
        console.log("New selected date:", newDate)
    }

    return (
        <div>
            <h2>Date Picker with Excluded Weekends</h2>
            <DatePicker filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} onDateChange={handleDateChange} dateFormat="yyyy/mm/dd" />
        </div>
    )
}

export default App
```

## Props

| Prop            | Type                      | Description                                   |
| --------------- | ------------------------- | --------------------------------------------- |
| `selectedDate`  | `Date`                    | The default date to display.                  |
| `onDateChange`  | `(date: Date) => void`    | Callback triggered when the date changes.     |
| `filterDate`    | `(date: Date) => boolean` | Filter function to disable specific dates.    |
| `disableFuture` | `boolean`                 | Disable the selection of future dates.        |
| `dateFormat`    | `string`                  | Custom date format (default is `dd/mm/yyyy`). |

## Custom Date Formats

You can specify the format in which the date is displayed using the `dateFormat` prop. The following formats are supported:

-   `dd/mm/yyyy` (default)
-   `mm/dd/yyyy`
-   `yyyy/mm/dd`
-   `yyyy-dd-mm`

## A few exemples of code :

This code snippet is an exemple of how to use `ChronoPick`, it features the `dateFormat Prop` :

```jsx
<DatePicker selectedDate={new Date()} onDateChange={(newDate) => console.log("Formatted date:", newDate)} dateFormat="yyyy/mm/dd" />
```

### Exclude Weekends

Use the `filterDate` prop to disable specific days. For example, you can exclude weekends:

```jsx
<DatePicker filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} onDateChange={(newDate) => console.log("Selected date:", newDate)} dateFormat="yyyy/mm/dd" />
```

### Disable Future Dates

To prevent selecting dates in the future, you can set the `disableFuture` prop to `true`:

```jsx
<DatePicker
    selectedDate={new Date()}
    disableFuture={true} // Disables selecting dates in the future
    onDateChange={(newDate) => console.log("Selected date:", newDate)}
/>
```

## Q&A :

**1. Can I use ChronoPick with TypeScript?**

Yes, `ChronoPick` is fully compatible with TypeScript. The `DatePickerProps` interface allows you to type-check the props passed to the component.

**2. Does ChronoPick support mobile browsers?**

Yes, `ChronoPick` is designed to be responsive and works across desktop and mobile browsers.

## License

`ChronoPick` is distributed under the MIT License. This license permits use, modification, and free distribution, provided that the MIT License text is included with any substantial distribution of the software. For more information, please refer to the LICENSE file included with this distribution or visit [MIT License](https://opensource.org/license/MIT).
