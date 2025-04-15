#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <assert.h>

typedef struct
{
    uint8_t x;
    uint8_t y;
    uint8_t z;
    uint8_t w;
}
CgVec4U8;

typedef struct
{
    float x;
    float y;
    float z;
    float w;
}
CgVec4F32;

CgVec4F32 cgConvertVec4U8ToF32(CgVec4U8 v)
{
    CgVec4F32 r = { .x = (float)v.x,
                    .y = (float)v.y,
                    .z = (float)v.z,
                    .w = (float)v.w };
    return r;
}

CgVec4U8 cgConvertVec4F32ToU8(CgVec4F32 v)
{
    CgVec4U8 r = { .x = (uint8_t)v.x,
                   .y = (uint8_t)v.y,
                   .z = (uint8_t)v.z,
                   .w = (uint8_t)v.w };
    return r;
}

uint32_t cgConvertVec4U8ToU32(CgVec4U8 color)
{
    uint32_t pixel = ((uint32_t)color.x) |
                     ((uint32_t)color.y << 8) |
                     ((uint32_t)color.z << 16) |
                     ((uint32_t)color.w << 24);
    return pixel;
}

CgVec4F32 cgLerpVec4F32(CgVec4F32 p,
                        CgVec4F32 q,
                        float k)
{
    CgVec4F32 r = {
        .x = (1.0f - k) * p.x + k * q.x,
        .y = (1.0f - k) * p.y + k * q.y,
        .z = (1.0f - k) * p.z + k * q.z,
        .w = (1.0f - k) * p.w + k * q.w
    };
    return r;
}

typedef struct
{
    uint32_t width;
    uint32_t height;
    uint32_t* pixels;
}
CgColorBufferU32;

CgColorBufferU32 cgCreateColorBufferU32(uint32_t width,
                                        uint32_t height)
{
    assert(width > 0 && height > 0 && "cgCreateColorBufferU32: width or height is zero");

    CgColorBufferU32 colorBuffer = {};
    colorBuffer.width = width;
    colorBuffer.height = height;
    colorBuffer.pixels = malloc(width * height * sizeof(uint32_t));
    if (!colorBuffer.pixels) {
        perror("cgCreateColorBufferU32");
        exit(EXIT_FAILURE);
    }
    return colorBuffer;
}

void cgClearColorBufferU32(CgColorBufferU32* restrict colorBuffer,
                           CgVec4U8 color)
{
    assert(colorBuffer && "cgClearColorBufferU32: colorBuffer is NULL");

    uint32_t pixel = cgConvertVec4U8ToU32(color);
    uint32_t resolution = colorBuffer->width * colorBuffer->height;
    for (uint32_t i = 0; i < resolution; ++i) {
        colorBuffer->pixels[i] = pixel;
    }
}

void cgGradientColorBufferU32(CgColorBufferU32* restrict colorBuffer,
                              CgVec4U8 topLeftColor,
                              CgVec4U8 topRightColor,
                              CgVec4U8 bottomLeftColor,
                              CgVec4U8 bottomRightColor)
{
    assert(colorBuffer && "cgGradientColorBufferU32: colorBuffer is NULL");

    CgVec4F32 topLeftColorF32 = cgConvertVec4U8ToF32(topLeftColor);
    CgVec4F32 topRightColorF32 = cgConvertVec4U8ToF32(topRightColor);
    CgVec4F32 bottomLeftColorF32 = cgConvertVec4U8ToF32(bottomLeftColor);
    CgVec4F32 bottomRightColorF32 = cgConvertVec4U8ToF32(bottomRightColor);

    for (uint32_t i = 0; i < colorBuffer->width; ++i) {
        float x = (float)i / (float)colorBuffer->width;
        for (uint32_t j = 0; j < colorBuffer->height; ++j) {
            float y = (float)j / (float)colorBuffer->height;

            CgVec4F32 topColor = cgLerpVec4F32(topLeftColorF32, topRightColorF32, x);
            CgVec4F32 bottomColor = cgLerpVec4F32(bottomLeftColorF32, bottomRightColorF32, x);
            CgVec4F32 finalColor = cgLerpVec4F32(topColor, bottomColor, y);

            CgVec4U8 color = cgConvertVec4F32ToU8(finalColor);
            uint32_t pixel = cgConvertVec4U8ToU32(color);
            colorBuffer->pixels[j * colorBuffer->width + i] = pixel;
        }
    }
}

void cgColorBufferU32ToPPM(const CgColorBufferU32* restrict colorBuffer,
                           const char* restrict path)
{
    assert(colorBuffer && "cgColorBufferU32ToPPM: colorBuffer is NULL");
    assert(path && "cgColorBufferU32ToPPM: path is NULL");

    FILE* fp = fopen(path, "w");
    if (!fp) {
        perror("cgColorBufferU32ToPPM");
        exit(EXIT_FAILURE);
    }
    fprintf(fp, "P3\n");
    fprintf(fp, "%u %u\n", colorBuffer->width, colorBuffer->height);
    fprintf(fp, "255\n");
    uint32_t resolution = colorBuffer->width * colorBuffer->height;
    for (uint32_t i = 0; i < resolution; ++i) {
        uint32_t pixel = colorBuffer->pixels[i];
        uint8_t red = *((uint8_t*)&pixel + 0);
        uint8_t green = *((uint8_t*)&pixel + 1);
        uint8_t blue = *((uint8_t*)&pixel + 2);
        fprintf(fp, "%u %u %u\n", red, green, blue);
    }
    fclose(fp);
}

int main()
{
    uint32_t width = 320;
    uint32_t height = 240;
    CgColorBufferU32 colorBuffer = cgCreateColorBufferU32(width, height);
    CgVec4U8 topLeftColor = { 255, 0, 0, 255 };
    CgVec4U8 topRightColor = { 0, 255, 0, 255 };
    CgVec4U8 bottomLeftColor = { 0, 0, 255, 255 };
    CgVec4U8 bottomRightColor = { 255, 255, 0, 255 };
    cgGradientColorBufferU32(&colorBuffer, topLeftColor, topRightColor, bottomLeftColor, bottomRightColor);
    cgColorBufferU32ToPPM(&colorBuffer, "sample.ppm");
    return 0;
}
