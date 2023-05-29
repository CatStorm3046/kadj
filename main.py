from instagrapi import Client
import json
import sys


username = sys.argv[1]

cl = Client(delay_range=[1, 3], request_timeout=10)
cl.set_user_agent("Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36")


info = cl.user_info_by_username(username)
data = {
    "name": info.full_name,
    "username": info.username,
    "biography": info.biography,
    "avatar": info.profile_pic_url_hd,
    "isPrivate": info.is_private,
    "postsCount": info.media_count,
    "followingCount": info.following_count,
    "followedByCount": info.follower_count,
}

with open("./data.json", "w") as outfile:
    json.dump(data, outfile)
