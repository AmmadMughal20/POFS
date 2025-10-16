import { Search } from 'lucide-react'
import InputWithIcon from '../InputWithIcon/InputWithIcon'

const Searchbar = ({ className }: any) =>
{
    return (
        <InputWithIcon name='search' icon={<Search />} iconPosition='right' placeholder='Search by product, order' className={className} />
    )
}

export default Searchbar