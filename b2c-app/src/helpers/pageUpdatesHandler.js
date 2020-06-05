export function onError(errors) {
    Object.keys(errors).forEach((key) => {
        const found = this.state.errors.some(el => {
            return el.id === errors[key].id;
        });
        if (!found){               
            this.state.errors.push(errors[key]);
        }
    });
}

export function onChange(valuesToSet) {
    Object.keys(valuesToSet).forEach((key) => {
        this.setState({ [key]: valuesToSet[key] });
    });
}