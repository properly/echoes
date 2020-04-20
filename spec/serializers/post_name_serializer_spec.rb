require "spec_helper"

describe PostNameSerializer do
  let(:post) {
    posts(:fb_post)
  }
  before do
    post.stub_chain(:revisions, :last, :contents, :first).and_return(
      contents(:fb_content)
    )
    @serializer = PostNameSerializer.new(post)
  end

  describe "target" do

    subject { @serializer }

    context "first is facebook" do
      it { subject.target.should eq "facebook"  }
    end

  end
end
