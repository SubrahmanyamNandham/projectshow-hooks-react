import './index.css'

const ProjectItem = props => {
  const {eachDetails} = props
  const {imageUrl, name} = eachDetails
  return (
    <li className="list">
      <img alt="img" src={imageUrl} className="imagelist" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectItem
