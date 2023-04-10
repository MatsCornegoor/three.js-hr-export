from PIL import Image
import glob
import re
import sys
import argparse

parser = argparse.ArgumentParser(description='Image Stitcher')
parser.add_argument("-r", "--root", help="Sets the squared root", type=int)
args = parser.parse_args()

if not args.rows:
    print("Please set the squared root using '-r <amount>'")
    sys.exit()

image_list = []
img_in_row = args.rows

# get files from src folder and sort
files = glob.glob('src/*.png')
files = sorted(files, key=lambda x:float(re.findall("(\d+)",x)[0]))


# open images
for filename in files:
    img = Image.open(filename)
    image_list.append(img)


def get_concat_h_multi_resize(im_list, resample=Image.BICUBIC):
    min_height = min(im.height for im in im_list)
    im_list_resize = [im.resize((int(im.width * min_height / im.height), min_height),resample=resample)
                      for im in im_list]
    total_width = sum(im.width for im in im_list_resize)
    dst = Image.new('RGBA', (total_width, min_height))
    pos_x = 0
    for im in im_list_resize:
        dst.paste(im, (pos_x, 0))
        pos_x += im.width
    return dst

def get_concat_v_multi_resize(im_list, resample=Image.BICUBIC):
    min_width = min(im.width for im in im_list)
    im_list_resize = [im.resize((min_width, int(im.height * min_width / im.width)),resample=resample)
                      for im in im_list]
    total_height = sum(im.height for im in im_list_resize)
    dst = Image.new('RGBA', (min_width, total_height))
    pos_y = 0
    for im in im_list_resize:
        dst.paste(im, (0, pos_y))
        pos_y += im.height
    return dst


def get_concat_tile_resize(im_list_2d, resample=Image.BICUBIC):
    im_list_v = [get_concat_h_multi_resize(im_list_h, resample=resample) for im_list_h in im_list_2d]
    return get_concat_v_multi_resize(im_list_v, resample=resample)



# split image array in rows
image_list_split = [image_list[i * img_in_row:(i + 1) * img_in_row] for i in range((len(image_list) + img_in_row - 1) // img_in_row )]


# create image
get_concat_tile_resize(image_list_split).save('dst/ImageStitcher.png')


