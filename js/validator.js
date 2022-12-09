function Validator(options){
    let isValid = false
    let selectorRules = {};
    if(formElement){
        /* Click button confirm validate hết tất cả các trường */
        formElement.onsubmit = function(event){
            let isFormValid = true;
            event.preventDefault();
            options.rules.forEach(function(rule){
                let inputElement = formElement.querySelector(rule.selector);
                let isValid = validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
        }
    }
    const getParent = (element,selector) => {
        /* selector: class(form-group)
            element: inputelement
         */
        while(element.parentElement){
            let parentElement = element.parentElement
            if (parentElement.matches(selector)) { /* kiểm tra element có match với selector hay ko */
                return parentElement;
            }
            element = parentElement;
        }
    }

    const validate = (inputElement,rule) => {
        let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        let errorMessage;
        let rules = selectorRules[rule.selector];
        for(let i = 0; i < rules.length; ++i){
           switch(inputElement.type){
                default: errorMessage = rules[i](inputElement.value);
           }
           if (errorMessage) break;
        }
        if(errorMessage){
            isValid = false;
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        }else{
            isValid = true
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }

     // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
    options.rules.forEach(function(rule){
        let inputElements = formElement.querySelectorAll(rule.selector);
        // Lưu lại các rules cho mỗi input
        if(Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test);
        }else{
            selectorRules[rule.selector] = [rule.test];
        }

        Array.from(inputElements).forEach(function(inputElement){
            inputElement.onblur = () => {
                validate(inputElement, rule);
                formElement.setAttribute('isValid', isValid);
            }

            inputElement.oninput = () => {
                let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                errorElement.innerText = '';
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
            }
        })
    });
}

Validator.isRequired = (selector,message) => {
    return {
        selector: selector,
        test: function(value){
            return value ? undefined: message || 'This field is required';
        }
    }
}

Validator.isEmail = (selector,message) => {
    return {
        selector: selector,
        test: function(value){
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'This field must be email';
        }
    }
}

Validator.isPhoneNumber = (selector,message) => {
    return {
        selector: selector,
        test: function(value){
            let regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
            return regex.test(value) ? undefined : message || 'invalid phone number';
        }
    }
}

Validator.isName = (selector,message) => {
    return {
        selector: selector,
        test: function(value){
            value = value.toLowerCase();
            let regex = /^([A-Za-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+)((\s{1}[a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+){0,5})$/;
            return regex.test(value) ? undefined : message || 'Name error'
        }
    }
}

