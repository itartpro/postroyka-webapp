import AdminLayout from 'components/admin/admin-layout'
import css from './admin-home.module.css'

export default function Admin() {
    return (
        <AdminLayout>
            <header className={'col start'}>
                <h1>Добро пожаловать в Админку</h1><br/>
                <small>Это "домашняя" страница админки, и здесь информация которая может служить как помощь для потенциальных разработчиков проекта</small>
            </header>
            <section>
                <div className={'col start '+css.div}>
                    <h3>Tech stack:</h3>
                    <p className={css.point}><a target="_blank" href="https://nextjs.org">Next.js</a> фреймворк для фронт-энда</p>
                    <p className={css.point}><a target="_blank" href="https://golang.org">Язык Go</a> использован для строения бинарных файлов для бэк-энда</p>
                    <p className={css.point}><a target="_blank" href="https://www.mongodb.com">MongoDB</a> база данных</p>
                </div>
                <div className={css.div+' '+css.lines}>
                    <h3>Схема работы сайта, по принципу Backends for Frontends:</h3>
                    <p className={css.point}><a target="_blank" href="https://docs.microsoft.com/ru-ru/azure/architecture/patterns/backends-for-frontends">Статья от Микрософта</a></p>
                    <p className={css.point}><a target="_blank" href="https://developer.ibm.com/depmodels/microservices/patterns/create-backend-for-frontend-application-architecture/">Статья от IBM</a></p>
                    <img src="https://itart.pro/images/techstack.svg" alt="Backends for Frontends" width={960} style={{maxWidth: '100%'}}/>
                    <br/>
                    <h4>Схема работы для сайта следующая:</h4><br/>
                    <p>Браузер посылает сообщения через веб-сокет, которые, в свою очередь, отфильтровываются через Next.js (в файле front/context/WsProvider.js). Next.Js отправляет сообщения веб сокет в бэк-энд (gowebbackend/gowebbackend) а бэк-энд уже присылает сообщения используя gRPC для послания инструкций для микросервисов.</p>
                    <p>Для инструкций gRPC испольуется файл .proto по данной схеме:</p>
                    <pre>{`
                    syntax = "proto3";

                    package grpcc;
                    option go_package="../grpcc";

                    message Data {
                        string address = 1;
                        string action = 2;
                        string instructions = 3;
                    }

                    message DataRequest {
                        Data data = 1;
                    }

                    message DataResponse {
                        string result = 1;
                    }

                    service CommunicationService{
                        //Unary
                        rpc PassData(DataRequest) returns (DataResponse) {};
                    }
                    `}</pre>
                </div>
                <div className={css.div+' '+css.lines}>
                    <h3>В итоге...</h3><br/>
                    <p>По сути, Вы можете полностью переписать фронт-энд, и сделать абсолютно другой сайт, при условии если Вы не будете затрагивать файл front/context/WsProvider.js (или если Вы не сильно измените формат передачи данных этого файла.)</p>
                    <p>Вы можете делать свои микросервисы, и можете указывать их в фронт-энде. Чтобы они работали Вам нужно отправить название сервиса, порт который он использует и инструкции. Всё это должно быть в строковом типе (string)</p>
                    <p>Возмём, к примеру, сервис для обработки картинок.</p>
                    <p>В файле для обработки, по веб сокет, оптравляется следующий объект, по команде request:</p>
                    <pre>{`
                    goData = {
                        name: 'somefilename.jpg',
                        type: 'image/jpg',
                        folder: 'banners'
                        size: 1048576,
                        address: 'gpics:50051',
                        action: 'insert'
                    }
                    request(JSON.stringify(goData), 'upload')
                    `}</pre>
                    <p>На этом примере, мы видим что в бэк-энд отправляется имя, тип, куда отправить файл, его размер, и адрес grpc на который отправить данные, и название микросервиса (gpics)</p>
                    <p>Бэкэнд смотрит на порт и название микросервиса, и всё в общем. Т.е. по gRPC передаётся следующее:</p>
                    <pre>{`
                    message Data {
                        'goservices:50051';
                        'gpics';
                        '{name: 'somefilename.jpg',type: 'image/jpg',location: 'banners',size: 1048576,address: 'goservices:50051',service: 'gpics'}';
                    }
                    `}</pre>
                    <p>Порт, название микросервиса, а остальное служит в качестве иснтрукции. Таким образом, Вы можете писать микросервисы на языке своего выбора, и либо заменять те что уже сделаны или добавлять свои. Если вы планируйте писать фронт-энд для мобильных устройств, то можете использовать существующие микросервисы и базы - используя вышеуказанный формат gRPC. Для gRPC главное знать по какому порту "звонить"</p>
                    <p>АppProvider.js использует метод "request(тип, данные)" для отправки сообщений в бэкэнд. Также он заботится (в связке с gowebbackend) о аутентификации пользователей используя JSON Web Tokens и SSL сертификаты для подтверждения авторизованных запросов с браузера к бэк-энду.</p>
                </div>
            </section>
        </AdminLayout>
    )
}