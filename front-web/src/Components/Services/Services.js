import "./Services.css"
import SingleService from "./SingleService"
import { ServicesContent } from "./ServicesContent"

function Services(props) {
    return (
        <div className="Services">
            {ServicesContent.map((val, key) => {
                return (
                   <SingleService key={key} link={val.link} logo={val.logo} name={val.name} services={props.services}
                    service={props.services.find(element => element.name === val.name)} setServices={props.setServices}/>
                )
            })}
        </div>
    )
}

export default Services