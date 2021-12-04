import PublicLayout from "components/public/public-layout";
import css from "styles/chat.module.css";
import {useRouter} from "next/router";
import {WsContext} from "context/WsProvider";
import {useState, useEffect, useContext} from "react";
import {timeDiff, timeInRus} from "libs/time-stuff";
import Link from "next/link";
import {nowToLocaleString} from "libs/js-time-to-psql";

const Chat = () => {
    const router = useRouter();
    const {wsMsg, verifiedJwt, request} = useContext(WsContext);
    const [user, setUser] = useState(null);
    const [convers, setConvers] = useState(null);
    const [details, setDetails] = useState(null);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if(!verifiedJwt) return false;
        const userString = window.localStorage.getItem('User');
        let usr;
        if(!userString) return false;
        try {
            usr = JSON.parse(userString);
            setUser(usr);
        } catch (e) {
            return false;
        }

        if(parseInt(router.query.offer) > 0) {
            const goData = {
                address: 'auth:50003',
                action: 'get-offers',
                instructions: JSON.stringify({
                    id: [parseInt(router.query.offer)],
                })
            };
            request(JSON.stringify(goData))
        }
    }, [verifiedJwt]);

    //handle info from server
    useEffect(() => {
        if (!wsMsg) return false;

        let msg = {};
        try {
            msg = JSON.parse(wsMsg.data);
        } catch (err) {
            console.log("could not parse data: ",wsMsg.data, err);
            return false
        }

        if(msg.data && msg.name === 'auth') {
            if(msg.data[0] && msg.data[0].hasOwnProperty('order_id')) {
                if(msg.data[0].customer_id === user.id) {
                    const goData = {
                        address: 'auth:50003',
                        action: 'get-simple-profile',
                        instructions: JSON.stringify({id:parseInt(msg.data[0].master_id)})
                    };
                    request(JSON.stringify(goData))
                }

                if(msg.data[0].master_id === user.id) {
                    const goData = {
                        address: 'auth:50003',
                        action: 'get-simple-profile',
                        instructions: JSON.stringify({id:parseInt(msg.data[0].customer_id)})
                    };
                    request(JSON.stringify(goData))
                }
            }

            if(msg.data.hasOwnProperty('last_online')) {
                setConvers(msg.data);
                let detail = {}
                detail.fullName = msg.data.last_name + ' ' + msg.data.first_name + (msg.data.paternal_name && ' ' + msg.data.paternal_name);
                detail.timeOnSite = timeInRus(timeDiff(Date.parse(msg.data.created), Date.now()));
                detail.lastOnline = timeInRus(timeDiff(Date.parse(msg.data.last_online), Date.now()));
                const masterAva = process.env.NEXT_PUBLIC_STATIC_URL+'/uploads/masters/'+msg.data.id+'/ava.jpg';
                detail.image = msg.data.avatar && masterAva || process.env.NEXT_PUBLIC_STATIC_URL+'/public/images/silhouette.jpg';
                setDetails(detail);
            }
        }

    }, [wsMsg]);

    const sendText = e => {
        e.preventDefault();
        if(text.length > 0) {
            messages.push({
                id:user.id,
                msg:text,
                time: nowToLocaleString('ru-RU')
            })
            setText("")
        }
        document.getElementById("text-field").focus();
    }

    return (
        <PublicLayout>
            <main className={`max`}>
                {convers && details && (
                    <div className={css.chat}>
                        <div className={css.d1}>
                            <Link href={`/master/${convers.id}`}>
                                <img src={details.image} alt={convers.first_name} width="150" height="150" loading="lazy"/>
                            </Link>
                            <b>{details.fullName}</b>
                            <p>На сайте {details.timeOnSite}</p>
                            <p>Был {details.lastOnline} назад</p>
                        </div>
                        <div className={css.d2}>
                            <div className={`col start`}>
                                {messages.length > 0 && messages.map((e, i) => {
                                    let time = "";
                                    if(nowToLocaleString('ru-RU').slice(0, 10) === e.time.slice(0, 10)) {
                                        time = e.time.slice(11, 17);
                                    } else {
                                        time = e.time;
                                    }
                                    if(e.id === user.id) {
                                        return (
                                            <p key={i} className={css.me}>{e.msg}<span>{time}</span></p>
                                        )
                                    } else {
                                        return (
                                            <p key={i} className={css.them}>{e.msg}<span>{time}</span></p>
                                        )
                                    }
                                })}
                            </div>
                            <form>
                                <input id="text-field" type="text" value={text} autoFocus onChange={e => setText(e.target.value)}/>
                                <input type="submit" value="Отправить" onClick={sendText}/>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </PublicLayout>
    )
}

export default Chat