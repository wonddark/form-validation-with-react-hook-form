interface FormControls {
    objectType: string;
    sludge: string;
    triggers: {
        thresholdName: string;
        thresholdColor: string;
        thresholdMinValue: number;
        thresholdMaxValue: number;
        thresholdDays: string;
    }[]
}

export default FormControls