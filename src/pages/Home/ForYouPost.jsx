import SinglePostTemplate from '../../component/Posts/single';
import { usePost } from '../../component/Posts/PostContext';
function ForYouPost() {
    const { HomePostData } = usePost();
    return (
        <div>
            {HomePostData && HomePostData.length > 0 ? (
                HomePostData.map(post => (
                    <SinglePostTemplate
                        key={post.post_id}
                        data={post}
                    />
                ))
            ) : (
                <div className="text-center">
                    <p>Fetching for posts <span className='fa fa-spinner fa-spin'></span></p>
                </div>
            )}
        </div>
    );
}

export default ForYouPost;