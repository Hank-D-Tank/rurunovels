import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const StorySlate = forwardRef(({ value, onChange }, ref) => {
    const [editorValue, setEditorValue] = useState(value);
    const quillRef = React.useRef(null);

    useEffect(() => {
        setEditorValue(value);
    }, [value]);

    useImperativeHandle(ref, () => ({
        getText: () => {
            if (quillRef.current) {
                return quillRef.current.getEditor().getText();
            }
            return '';
        }
    }));

    const handleChange = (content, delta, source, editor) => {
        setEditorValue(content);
        const text = editor.getText();
        console.log('Text content:', text);
        onChange(content);
    };

    return (
        <div className="row" style={{ height: "90%" }}>
            <div className="col-md-12 pb-5">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={editorValue}
                    onChange={handleChange}
                    className='story-writing-board'
                    modules={{
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'align': [] }],
                            ['clean']
                        ],
                    }}
                />
            </div>
        </div>
    );
});

export default StorySlate;
