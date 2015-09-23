var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

ArticleSchema.virtual('summary').get(function(){
    var reg = new RegExp("<[^<]*>", "gi");
    return this.content.replace(reg,'').substring(0,250) + '...';
});
ArticleSchema.set('toJSON', { getters: true, virtuals: true});
mongoose.model('Article', ArticleSchema);