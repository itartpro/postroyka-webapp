import 'suneditor/dist/css/suneditor.min.css'
import {useRef, useState} from 'react'
import DropImages from './dropzone/drop-images'
import dynamic from 'next/dynamic'

export default function Wysiwyg({drop_name, setBodyText, bodyText, imageLocation, instructions}) {
    const editorRef = useRef();
    const dropRef = useRef();
    const [showDrop, setShowDrop] = useState(false);

    const SunEditor = dynamic(
        () => import('suneditor-react'),
        { ssr: false }
    );

    const getSunEditorInstance = sunEditor => {
        editorRef.current = sunEditor
    };

    const editWYSIWYGGallery = () => {
        if(!imageLocation) return false;
        if(!showDrop) setShowDrop(true);
        const st = dropRef.current.style;
        if(st.maxHeight === 'initial') {
            st.maxHeight = '600px';
            setTimeout(() => {st.maxHeight = '0px'}, 300);
            st.overflow = 'hidden';
        } else {
            st.maxHeight = '600px';
            st.transition = 'all .3s'
            st.overflow = 'hidden';
            setTimeout(() => {st.maxHeight = 'initial'}, 300);
        }
    }

    if(instructions && imageLocation) instructions.location = imageLocation;

    const edit_gallery = {
        name: 'edit_gallery',
        title: 'Редактировать галерею',
        display: 'command',
        add: (core, targetElement) => {
            const context = core.context;
            context.customCommand = {
                targetButton: targetElement
            };
        },
        innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'+
            '<path fill="none" stroke="#000" stroke-linecap="round" stroke-width="6" d="M31 48V3M16 20L31 3l15 16"/>'+
            '<path fill="none" stroke="#000" stroke-linecap="round" stroke-width="6" d="M8 46v16h46V46"/></svg>',
        action: editWYSIWYGGallery
    };

    const sunOptions = {
        height: 300,
        pasteTagsBlacklist: 'span|pre|style|&nbps;',
        imageFileInput: false,
        charCounter: true,
        placeholder: "Напишите эпос...или хотя бы 3000 символов для SEO. Вы ведь молодца...Вам ведь нужен SEO.",
        buttonList: [
            ['codeView', 'showBlocks'],
            ['formatBlock', 'list', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule'],
            ['table', 'link'],
            ['removeFormat', 'preview']
        ]
    };

    if(imageLocation) {
        const imageStuff = ['video', 'image', 'imageGallery', 'edit_gallery']
        sunOptions.imageGalleryUrl = '/api/sungallery/'+imageLocation.split('/').join('-')
        sunOptions.buttonList[4].push(...imageStuff)
        sunOptions.plugins = [edit_gallery]
    }

    return (
        <>
            <SunEditor
                lang="ru"
                setDefaultStyle="font-family: Arial, sans-serif; font-size: 1rem;"
                getSunEditorInstance={getSunEditorInstance}
                setOptions={sunOptions}
                defaultValue={bodyText}
                onChange={val => setBodyText(val)}
            />
            <style global jsx>{`
              .sun-editor {
                margin-bottom: 20px;
              }
            `}</style>
            {showDrop && <DropImages dropRef={dropRef} drop_name={drop_name} instructions={instructions} />}
        </>
    );
};