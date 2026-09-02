type Props = {
    mediaId: string;
    value: number;
    onRatingChange: (rating: number) => void;
}

export function MediaRating(
    {
        mediaId,
        value,
        onRatingChange,
    }: Props) {
//TODO Check to loop the input
    return (
        <div className="rating rating-lg rating-half">
            <input type="radio" name={`rating-${mediaId}`} value="0" className="rating-hidden"
                   checked={value === 0} onChange={()=>onRatingChange(1)}
                   aria-label="0 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="1"
                   checked={value === 1} onChange={()=>{}}
                   className="mask mask-heart mask-half-1 bg-red-400"
                   aria-label="1 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="2"
                   checked={value === 2} onChange={()=>{}}
                   className="mask mask-heart mask-half-2 bg-red-400"
                   aria-label="2 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="3"
                   checked={value === 3} onChange={()=>{}}
                   className="mask mask-heart mask-half-1 bg-orange-400"
                   aria-label="3 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="4"
                   checked={value === 4} onChange={()=>{}}
                   className="mask mask-heart mask-half-2 bg-orange-400"
                   aria-label="4 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="5"
                   checked={value === 5} onChange={()=>{}}
                   className="mask mask-heart mask-half-1 bg-yellow-400"
                   aria-label="5 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="6"
                   checked={value === 6} onChange={()=>{}}
                   className="mask mask-heart mask-half-2 bg-yellow-400"
                   aria-label="6 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="7"
                   checked={value === 7} onChange={()=>{}}
                   className="mask mask-heart mask-half-1 bg-lime-400"
                   aria-label="7 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="8"
                   checked={value === 8} onChange={()=>{}}
                   className="mask mask-heart mask-half-2 bg-lime-400"
                   aria-label="8 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="9"
                   checked={value === 9} onChange={()=>{}}
                   className="mask mask-heart mask-half-1 bg-green-400"
                   aria-label="9 sur 10"/>
            <input type="radio" name={`rating-${mediaId}`} value="10"
                   checked={value === 10} onChange={()=>{}}
                   className="mask mask-heart mask-half-2 bg-green-400"
                   aria-label="10 sur 10"/>
        </div>
    );
}