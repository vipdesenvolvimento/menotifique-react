import { createContext } from 'react';
// import { Container } from './styles';

const FormContext = createContext({
    setCeps: () => {},
    setDistricts: () => {},
    setCitys: () => {},
    setCustoms: () => {},
    ceps: null,
    districts: [],
    citys: null,
    customs: null,
    except: null,
    setException: () => {},
})

export default FormContext;