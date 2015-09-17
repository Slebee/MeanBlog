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

//虚拟属性--概述，概述使用虚拟属性的方式，并不需要存储到数据库中
ArticleSchema.virtual('summary').get(function(){
    var reg = new RegExp("<[^<]*>", "gi");
    return this.content.replace(reg,'').substring(0,250) + '...';
});
ArticleSchema.set('toJSON', { getters: true, virtuals: true});
mongoose.model('Article', ArticleSchema);