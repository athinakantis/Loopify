import clsx from "clsx";

export default Search(props) {
    const {type, placeholder, name, className, ...rest} = props;
    const classes = clsx(className);
    
    return <input type={type} placeholder={placeholder} name={name} {...rest}/>;
}