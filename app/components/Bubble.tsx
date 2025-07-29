import { marked } from 'marked';

const Bubble = ({ message }) => {
 const { content, role } = message;
 
 const isAssistant = role === 'assistant';
 
 return (
   <div 
     className={`${role} bubble`}
     {...(isAssistant 
       ? { dangerouslySetInnerHTML: { __html: marked.parse(content) } }
       : { children: content }
     )}
   />
 );
}

export default Bubble;