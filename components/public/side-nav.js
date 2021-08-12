import Link from 'next/link';
import {BsGear,BsPersonBoundingBox} from 'react-icons/bs';
import css from './side-nav.module.css';

const SideNav = ({user}) => {
    return (
        <>
            <ul className={`col start ${css.u1}`}>
                <li>
                    <BsPersonBoundingBox/>
                    <Link href={`/profile/${user.id}`}><a>Моя страница</a></Link>
                </li>
                <li>
                    <BsGear/>
                    <Link href={`/settings`}><a>Настройки</a></Link>
                </li>
            </ul>
        </>
    )
}

export default SideNav;