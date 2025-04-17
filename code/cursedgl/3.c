#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <assert.h>
#include <math.h>
#include <stdarg.h>
#include <time.h>

typedef struct
{
    float x;
    float y;
    float z;
    float w;
}
CgVec4F32;

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
    CgVec4F32* pixels;
}
CgColorBufferF32;

typedef struct
{
    void* (*alloc_mem)(size_t);
    void (*free_mem)(void*);
}
CgMemoryAllocator;

CgMemoryAllocator* cgGetDefaultAllocator()
{
    static CgMemoryAllocator allocator = {
        .alloc_mem = malloc,
        .free_mem = free
    };
    return &allocator;
}

#define CG_LOG_MAX 500

__attribute__((format(printf, 1, 2)))
void CgDefaultErrorCallback(const char* args, ...)
{
    va_list ap;
    va_start(ap, args);
    char output[CG_LOG_MAX];
    vsnprintf(output, CG_LOG_MAX, args, ap);
    va_end(ap);
    printf("[CgDefaultErrorCallback]: %s\n", output);
    exit(EXIT_FAILURE);
}

typedef void (*CgErrorCallback)(const char*, ...);

typedef struct
{
    CgMemoryAllocator* allocator;
    CgErrorCallback callback;
}
CgApplication;

CgColorBufferF32 cgCreateColorBufferF32(uint32_t width,
                                        uint32_t height,
                                        CgApplication* application)
{
    assert(width > 0 && height > 0 && "cgCreateColorBufferF32: width or height is zero");
    assert(application && "cgCreateColorBufferF32: application is NULL");
    assert(application->allocator && "cgCreateColorBufferF32: allocator is NULL");
    assert(application->callback && "cgCreateColorBufferF32: callback is NULL");

    CgColorBufferF32 colorBuffer = {};
    colorBuffer.width = width;
    colorBuffer.height = height;
    colorBuffer.pixels = application->allocator->alloc_mem(width * height * sizeof(CgVec4F32));
    if (!colorBuffer.pixels) {
        application->callback("cgCreateColorBufferF32: memory allocation failed");
    }
    return colorBuffer;
}

void cgDestroyColorBufferF32(CgColorBufferF32* buffer,
                             CgApplication* application)
{
    assert(buffer && "cgDestroyColorBufferF32: buffer is NULL");
    assert(application && "cgDestroyColorBufferF32: application is NULL");
    assert(application->allocator && "cgDestroyColorBufferF32: allocator is NULL");

    application->allocator->free_mem(buffer->pixels);
    buffer->width = buffer->height = 0;
}

void cgGradientColorBufferF32(CgColorBufferF32* restrict colorBuffer,
                              CgVec4F32 topLeftColor,
                              CgVec4F32 topRightColor,
                              CgVec4F32 bottomLeftColor,
                              CgVec4F32 bottomRightColor)
{
    assert(colorBuffer && "cgGradientColorBufferU32: colorBuffer is NULL");

    for (uint32_t i = 0; i < colorBuffer->width; ++i) {
        float x = (float)i / (float)colorBuffer->width;
        for (uint32_t j = 0; j < colorBuffer->height; ++j) {
            float y = (float)j / (float)colorBuffer->height;

            CgVec4F32 topColor = cgLerpVec4F32(topLeftColor, topRightColor, x);
            CgVec4F32 bottomColor = cgLerpVec4F32(bottomLeftColor, bottomRightColor, x);
            CgVec4F32 finalColor = cgLerpVec4F32(topColor, bottomColor, y);

            colorBuffer->pixels[j * colorBuffer->width + i] = finalColor;
        }
    }
}

CgVec4F32 cgApplyGammaToVec4F32(CgVec4F32 pixel, float gamma)
{
    CgVec4F32 gammaEncodedPixel = {
        .x = powf(pixel.x, 1.0f / gamma),
        .y = powf(pixel.y, 1.0f / gamma),
        .z = powf(pixel.z, 1.0f / gamma),
        .w = pixel.w
    };
    return gammaEncodedPixel;
}

void cgColorBufferF32ToPPM(const CgColorBufferF32* restrict colorBuffer,
                           const char* restrict path,
                           float gamma,
                           CgApplication* application)
{
    assert(colorBuffer && "cgColorBufferF32ToPPM: colorBuffer is NULL");
    assert(path && "cgColorBufferF32ToPPM: path is NULL");
    assert(application && "cgColorBufferF32ToPPM: application is NULL");
    assert(application->callback && "cgColorBufferF32ToPPM: callback is NULL");

    FILE* fp = fopen(path, "w");
    if (!fp) {
        application->callback("cgColorBufferF32ToPPM: couldn't open file '%s'\n", path);
    }
    fprintf(fp, "P3\n");
    fprintf(fp, "%u %u\n", colorBuffer->width, colorBuffer->height);
    fprintf(fp, "255\n");
    uint32_t resolution = colorBuffer->width * colorBuffer->height;
    for (uint32_t i = 0; i < resolution; ++i) {
        CgVec4F32 pixel = colorBuffer->pixels[i];
        CgVec4F32 gammaEncodedPixel = cgApplyGammaToVec4F32(pixel, gamma);
        uint8_t red = (uint8_t)(gammaEncodedPixel.x * 255.0f);
        uint8_t green = (uint8_t)(gammaEncodedPixel.y * 255.0f);
        uint8_t blue = (uint8_t)(gammaEncodedPixel.z * 255.0f);
        fprintf(fp, "%u %u %u\n", red, green, blue);
    }
    fclose(fp);
}

int main()
{
    uint32_t width = 320;
    uint32_t height = 240;
    float gamma = 2.2f;

    CgApplication application = {
        .allocator = cgGetDefaultAllocator(),
        .callback = CgDefaultErrorCallback
    };

    CgColorBufferF32 colorBuffer = cgCreateColorBufferF32(width, height, &application);
    CgVec4F32 topLeftColor = { 1.0f, 0.0f, 0.0f, 1.0f };
    CgVec4F32 topRightColor = { 0.0f, 1.0f, 0.0f, 1.0f };
    CgVec4F32 bottomLeftColor = { 0.0f, 0.0f, 1.0f, 1.0f };
    CgVec4F32 bottomRightColor = { 1.0f, 1.0f, 0.0f, 1.0f };
    cgGradientColorBufferF32(&colorBuffer, topLeftColor, topRightColor, bottomLeftColor, bottomRightColor);
    cgColorBufferF32ToPPM(&colorBuffer, "sample.ppm", gamma, &application);
    cgDestroyColorBufferF32(&colorBuffer, &application);
    return 0;
}
