const Label = ({ children, htmlFor }) => (
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={htmlFor}>
      {children}
    </label>
  );
  
  export default Label;