import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Homepage from "../pages/Homepage";
import LoginAmbulanceAndHospital from "../pages/SignupAdmin";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Homepage">
                <Homepage/>
            </ComponentPreview>
            <ComponentPreview
                path="/LoginAmbulanceAndHospital">
                <LoginAmbulanceAndHospital/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews